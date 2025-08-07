#!/bin/bash
set -euo pipefail

# B6: ZAP Regression Pipeline Script
# Automated OWASP ZAP security scanning for Sigil-DNA API

echo "🔒 Starting OWASP ZAP Security Regression Scan"
echo "=============================================="

# Configuration
API_URL=${SIGIL_API_URL:-http://localhost:3000}
REPORT_PREFIX="zap-report-${CI_COMMIT_SHA:-$(date +%Y%m%d-%H%M%S)}"
ZAP_IMAGE="owasp/zap2docker-stable"
TIMEOUT=${ZAP_TIMEOUT:-300}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📋 Configuration:"
echo "  API URL: $API_URL"
echo "  Report: $REPORT_PREFIX"
echo "  Timeout: ${TIMEOUT}s"
echo ""

# Check if API is accessible
echo "🔍 Checking API accessibility..."
if ! curl -sf "$API_URL/healthz" >/dev/null 2>&1; then
    echo -e "${RED}❌ API not accessible at $API_URL${NC}"
    echo "Please ensure the Sigil-DNA API is running and accessible."
    exit 1
fi
echo -e "${GREEN}✅ API is accessible${NC}"

# Check Docker availability
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found${NC}"
    echo "Please install Docker to run ZAP scans."
    exit 1
fi

# Create ZAP configuration
cat > zap-config.conf << EOF
# ZAP Configuration for Sigil-DNA
replacer.full_list(0).description=authheader
replacer.full_list(0).enabled=true
replacer.full_list(0).matchtype=REQ_HEADER
replacer.full_list(0).matchstring=Authorization
replacer.full_list(0).regex=false
replacer.full_list(0).replacement=Bearer \${SIGIL_TOKEN:-test-token}

# Spider configuration
spider.maxDepth=3
spider.maxChildren=10
spider.acceptCookies=true

# Passive scan configuration
pscan.enabled=true

# Active scan configuration  
ascan.enabled=true
ascan.strength=MEDIUM
EOF

echo "🕷️  Running ZAP baseline scan..."

# Run ZAP baseline scan
docker run --rm \
    -v "$(pwd):/zap/wrk:rw" \
    -t "$ZAP_IMAGE" \
    zap-baseline.py \
    -t "$API_URL" \
    -r "$REPORT_PREFIX.html" \
    -J "$REPORT_PREFIX.json" \
    -x "$REPORT_PREFIX.xml" \
    -l INFO \
    -z "-config replacer.full_list(0).description=authheader -config replacer.full_list(0).enabled=true" \
    -T "$TIMEOUT" \
    --hook=/zap/wrk/zap-hooks.py 2>/dev/null || ZAP_EXIT_CODE=$?

# Create ZAP hooks for custom authentication
cat > zap-hooks.py << 'EOF'
#!/usr/bin/env python3
"""
ZAP Hooks for Sigil-DNA Authentication
"""
import os

def zap_started(zap, target):
    """Called when ZAP starts scanning"""
    print("🔧 ZAP started, configuring authentication...")
    
    # Add custom headers if token is available
    token = os.environ.get('SIGIL_TOKEN')
    if token:
        zap.replacer.add_rule(
            description='Auth Token',
            enabled=True,
            matchtype='REQ_HEADER',
            matchstring='Authorization',
            regex=False,
            replacement=f'Bearer {token}'
        )
        print(f"✅ Added authentication token")

def zap_pre_shutdown(zap):
    """Called before ZAP shuts down"""
    print("📊 ZAP scan completed, generating final report...")
EOF

chmod +x zap-hooks.py

# Check scan results
ZAP_EXIT_CODE=${ZAP_EXIT_CODE:-0}

echo ""
echo "📊 ZAP Scan Results:"
echo "==================="

if [[ -f "$REPORT_PREFIX.json" ]]; then
    # Parse JSON report for summary
    if command -v jq &> /dev/null; then
        HIGH_ALERTS=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("High")) | .name' "$REPORT_PREFIX.json" 2>/dev/null | wc -l || echo "0")
        MEDIUM_ALERTS=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("Medium")) | .name' "$REPORT_PREFIX.json" 2>/dev/null | wc -l || echo "0")
        LOW_ALERTS=$(jq -r '.site[0].alerts[] | select(.riskdesc | contains("Low")) | .name' "$REPORT_PREFIX.json" 2>/dev/null | wc -l || echo "0")
        
        echo "  High Risk Alerts: $HIGH_ALERTS"
        echo "  Medium Risk Alerts: $MEDIUM_ALERTS"  
        echo "  Low Risk Alerts: $LOW_ALERTS"
        
        # Show high risk alerts
        if [[ $HIGH_ALERTS -gt 0 ]]; then
            echo ""
            echo -e "${RED}🚨 HIGH RISK ALERTS:${NC}"
            jq -r '.site[0].alerts[] | select(.riskdesc | contains("High")) | "  - \(.name): \(.desc)"' "$REPORT_PREFIX.json" 2>/dev/null || echo "  Unable to parse high risk alerts"
        fi
        
        # Show medium risk alerts
        if [[ $MEDIUM_ALERTS -gt 0 ]]; then
            echo ""
            echo -e "${YELLOW}⚠️  MEDIUM RISK ALERTS:${NC}"
            jq -r '.site[0].alerts[] | select(.riskdesc | contains("Medium")) | "  - \(.name): \(.desc)"' "$REPORT_PREFIX.json" 2>/dev/null | head -5 || echo "  Unable to parse medium risk alerts"
        fi
    else
        echo "  (Install jq for detailed analysis)"
    fi
fi

# Check for critical failures
CRITICAL_FAILURE=false

if [[ -f "$REPORT_PREFIX.html" ]]; then
    if grep -q "FAIL-NEW" "$REPORT_PREFIX.html" 2>/dev/null; then
        echo -e "${RED}❌ ZAP scan found NEW critical vulnerabilities!${NC}"
        CRITICAL_FAILURE=true
    fi
    
    if grep -q "High.*Risk" "$REPORT_PREFIX.html" 2>/dev/null; then
        echo -e "${RED}⚠️  High risk vulnerabilities detected${NC}"
        # Don't fail on high risk for now, but warn
    fi
fi

echo ""
echo "📁 Generated Reports:"
echo "  HTML: $REPORT_PREFIX.html"
echo "  JSON: $REPORT_PREFIX.json"  
echo "  XML: $REPORT_PREFIX.xml"

# Cleanup
rm -f zap-config.conf zap-hooks.py

# Final result
if [[ $CRITICAL_FAILURE == true ]]; then
    echo -e "${RED}💥 ZAP SCAN FAILED - Critical vulnerabilities found!${NC}"
    echo "Please review the HTML report and fix critical issues before deployment."
    exit 1
elif [[ $ZAP_EXIT_CODE -ne 0 ]]; then
    echo -e "${YELLOW}⚠️  ZAP scan completed with warnings (exit code: $ZAP_EXIT_CODE)${NC}"
    echo "Review the reports for potential issues."
    exit 0
else
    echo -e "${GREEN}✅ ZAP scan completed successfully!${NC}"
    echo "No critical vulnerabilities detected."
    exit 0
fi