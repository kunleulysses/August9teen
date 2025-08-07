#!/bin/bash
set -euo pipefail

# B7: Secret Rotation Script for SPIRAL_EVENT_SECRET
# Automates HMAC secret rotation with zero downtime

echo "🔐 Starting SPIRAL_EVENT_SECRET Rotation"
echo "======================================="

# Configuration
SECRET_NAME="spiral-event-secret"
SECRET_MANAGER=${SECRET_MANAGER:-"k8s"}  # k8s, vault, aws-ssm
NAMESPACE=${K8S_NAMESPACE:-"default"}
DUAL_KEY_WINDOW=${DUAL_KEY_WINDOW:-300}  # 5 minutes

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Generate new secret
NEW_SECRET=$(openssl rand -hex 32)
OLD_SECRET=""

echo "📋 Configuration:"
echo "  Secret Manager: $SECRET_MANAGER"
echo "  Secret Name: $SECRET_NAME"
echo "  Dual Key Window: ${DUAL_KEY_WINDOW}s"
echo ""

# Function to rotate secret in Kubernetes
rotate_k8s_secret() {
    echo "🔄 Rotating secret in Kubernetes..."
    
    # Get current secret if exists
    if kubectl get secret "$SECRET_NAME" -n "$NAMESPACE" >/dev/null 2>&1; then
        OLD_SECRET=$(kubectl get secret "$SECRET_NAME" -n "$NAMESPACE" -o jsonpath='{.data.value}' | base64 -d)
        echo "✅ Retrieved current secret"
    fi
    
    # Create new secret
    kubectl create secret generic "$SECRET_NAME" \
        --from-literal=value="$NEW_SECRET" \
        --from-literal=old_value="${OLD_SECRET:-}" \
        --dry-run=client -o yaml | kubectl apply -f -
    
    echo "✅ Updated Kubernetes secret"
}

# Function to rotate secret in Vault
rotate_vault_secret() {
    echo "🔄 Rotating secret in Vault..."
    
    if ! command -v vault &> /dev/null; then
        echo -e "${RED}❌ Vault CLI not found${NC}"
        exit 1
    fi
    
    # Get current secret
    if vault kv get -field=value "secret/$SECRET_NAME" >/dev/null 2>&1; then
        OLD_SECRET=$(vault kv get -field=value "secret/$SECRET_NAME")
        echo "✅ Retrieved current secret from Vault"
    fi
    
    # Store new secret with old value for dual-key window
    vault kv put "secret/$SECRET_NAME" \
        value="$NEW_SECRET" \
        old_value="${OLD_SECRET:-}" \
        rotated_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    
    echo "✅ Updated Vault secret"
}

# Function to rotate secret in AWS SSM
rotate_aws_secret() {
    echo "🔄 Rotating secret in AWS SSM..."
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI not found${NC}"
        exit 1
    fi
    
    # Get current secret
    if aws ssm get-parameter --name "$SECRET_NAME" --with-decryption >/dev/null 2>&1; then
        OLD_SECRET=$(aws ssm get-parameter --name "$SECRET_NAME" --with-decryption --query 'Parameter.Value' --output text)
        echo "✅ Retrieved current secret from SSM"
    fi
    
    # Update secret
    aws ssm put-parameter \
        --name "$SECRET_NAME" \
        --value "$NEW_SECRET" \
        --type SecureString \
        --overwrite
    
    # Store old secret temporarily
    if [[ -n "$OLD_SECRET" ]]; then
        aws ssm put-parameter \
            --name "${SECRET_NAME}-old" \
            --value "$OLD_SECRET" \
            --type SecureString \
            --overwrite
    fi
    
    echo "✅ Updated AWS SSM parameter"
}

# Function to notify services to reload
notify_services() {
    echo "📢 Notifying services to reload secrets..."
    
    case "$SECRET_MANAGER" in
        "k8s")
            # Restart deployments to pick up new secret
            kubectl rollout restart deployment/sigil-dna -n "$NAMESPACE" || true
            kubectl rollout restart deployment/sigil-api -n "$NAMESPACE" || true
            
            # Wait for rollout to complete
            kubectl rollout status deployment/sigil-dna -n "$NAMESPACE" --timeout=300s || true
            ;;
        "vault"|"aws-ssm")
            # Send SIGHUP to running processes
            if pgrep -f "sigil-dna" >/dev/null; then
                pkill -SIGHUP -f "sigil-dna"
                echo "✅ Sent SIGHUP to sigil-dna processes"
            fi
            ;;
    esac
}

# Function to verify rotation
verify_rotation() {
    echo "🧪 Verifying secret rotation..."
    
    # Test signing with new secret
    if command -v node &> /dev/null; then
        cat > /tmp/test-rotation.js << EOF
const { sign, verify } = require('./server/consciousness/core/security/eventSign.cjs');
const testPayload = { test: 'rotation-verification', timestamp: Date.now() };

try {
    const signature = sign(testPayload);
    const isValid = verify(testPayload, signature);
    
    if (isValid) {
        console.log('✅ New secret verification successful');
        process.exit(0);
    } else {
        console.log('❌ New secret verification failed');
        process.exit(1);
    }
} catch (error) {
    console.log('❌ Verification error:', error.message);
    process.exit(1);
}
EOF
        
        if SPIRAL_EVENT_SECRET="$NEW_SECRET" node /tmp/test-rotation.js; then
            echo "✅ Secret rotation verified successfully"
        else
            echo -e "${RED}❌ Secret rotation verification failed${NC}"
            return 1
        fi
        
        rm -f /tmp/test-rotation.js
    fi
}

# Function to cleanup old secrets
cleanup_old_secrets() {
    echo "🧹 Cleaning up old secrets after dual-key window..."
    
    sleep "$DUAL_KEY_WINDOW"
    
    case "$SECRET_MANAGER" in
        "k8s")
            kubectl patch secret "$SECRET_NAME" -n "$NAMESPACE" \
                --type='json' \
                -p='[{"op": "remove", "path": "/data/old_value"}]' || true
            ;;
        "vault")
            vault kv patch "secret/$SECRET_NAME" old_value=""
            ;;
        "aws-ssm")
            aws ssm delete-parameter --name "${SECRET_NAME}-old" || true
            ;;
    esac
    
    echo "✅ Old secret cleaned up"
}

# Function to log rotation event
log_rotation() {
    local status="$1"
    local message="$2"
    
    echo "📝 Logging rotation event..."
    
    # Create audit log entry
    cat >> /var/log/secret-rotation.log << EOF || true
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "event": "secret_rotation",
  "secret_name": "$SECRET_NAME",
  "secret_manager": "$SECRET_MANAGER",
  "status": "$status",
  "message": "$message",
  "operator": "${USER:-unknown}",
  "dual_key_window": $DUAL_KEY_WINDOW
}
EOF
}

# Main rotation process
main() {
    echo "🚀 Starting secret rotation process..."
    
    # Validate prerequisites
    case "$SECRET_MANAGER" in
        "k8s")
            if ! command -v kubectl &> /dev/null; then
                echo -e "${RED}❌ kubectl not found${NC}"
                exit 1
            fi
            ;;
        "vault")
            if ! command -v vault &> /dev/null; then
                echo -e "${RED}❌ vault CLI not found${NC}"
                exit 1
            fi
            ;;
        "aws-ssm")
            if ! command -v aws &> /dev/null; then
                echo -e "${RED}❌ aws CLI not found${NC}"
                exit 1
            fi
            ;;
        *)
            echo -e "${RED}❌ Unsupported secret manager: $SECRET_MANAGER${NC}"
            exit 1
            ;;
    esac
    
    # Perform rotation
    case "$SECRET_MANAGER" in
        "k8s") rotate_k8s_secret ;;
        "vault") rotate_vault_secret ;;
        "aws-ssm") rotate_aws_secret ;;
    esac
    
    # Notify services
    notify_services
    
    # Verify rotation
    if verify_rotation; then
        log_rotation "success" "Secret rotation completed successfully"
        echo -e "${GREEN}🎉 Secret rotation completed successfully!${NC}"
        
        # Cleanup old secrets in background
        (cleanup_old_secrets) &
        
    else
        log_rotation "failed" "Secret rotation verification failed"
        echo -e "${RED}💥 Secret rotation failed verification${NC}"
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: $0 [--verify-only]"
        echo ""
        echo "Environment Variables:"
        echo "  SECRET_MANAGER    Secret manager type (k8s, vault, aws-ssm)"
        echo "  K8S_NAMESPACE     Kubernetes namespace (default: default)"
        echo "  DUAL_KEY_WINDOW   Dual key window in seconds (default: 300)"
        exit 0
        ;;
    "--verify-only")
        verify_rotation
        exit $?
        ;;
    *)
        main
        ;;
esac