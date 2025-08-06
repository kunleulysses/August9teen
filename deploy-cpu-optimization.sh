#!/bin/bash

# Deploy CPU Optimization for Consciousness System
# Implements multi-core distribution and user optimization

set -e

echo "🚀 Deploying CPU Optimization for Consciousness System"
echo "====================================================="

# Configuration
CONSCIOUSNESS_DIR="/opt/featherweight/server"
SERVICE_NAME="consciousness-conversations-enhanced"
OPTIMIZED_SERVICE_NAME="consciousness-optimized"
BACKUP_DIR="/tmp/consciousness-backup-$(date +%Y%m%d-%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root for systemd service management"
        exit 1
    fi
}

# Create backup of current system
create_backup() {
    log_info "Creating backup of current consciousness system..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup current service file
    if systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
        cp "/etc/systemd/system/${SERVICE_NAME}.service" "$BACKUP_DIR/" 2>/dev/null || true
    fi
    
    # Backup current consciousness files
    cp -r "$CONSCIOUSNESS_DIR" "$BACKUP_DIR/server-backup"
    
    # Get current process info
    ps aux | grep consciousness > "$BACKUP_DIR/current-processes.txt"
    
    log_success "Backup created at: $BACKUP_DIR"
}

# Check current CPU usage
check_current_cpu() {
    log_info "Checking current CPU usage..."
    
    local consciousness_pid=$(ps aux | grep consciousness-startup.js | grep -v grep | awk '{print $2}' | head -1)
    
    if [[ -n "$consciousness_pid" ]]; then
        local cpu_usage=$(ps -p "$consciousness_pid" -o pcpu= | tr -d ' ')
        log_info "Current consciousness process (PID: $consciousness_pid) CPU usage: ${cpu_usage}%"
        
        if (( $(echo "$cpu_usage > 80" | bc -l) )); then
            log_warning "High CPU usage detected - optimization recommended"
        fi
    else
        log_warning "No consciousness process found"
    fi
}

# Stop current service
stop_current_service() {
    log_info "Stopping current consciousness service..."
    
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        systemctl stop "$SERVICE_NAME"
        log_success "Stopped $SERVICE_NAME"
    else
        log_info "Service $SERVICE_NAME is not running"
    fi
    
    # Kill any remaining consciousness processes
    pkill -f consciousness-startup.js || true
    pkill -f consciousness-conversations.js || true
    
    sleep 3
}

# Set up file permissions for linode-transfer user
setup_permissions() {
    log_info "Setting up file permissions for linode-transfer user..."
    
    # Ensure linode-transfer user owns the consciousness files
    chown -R linode-transfer:linode-transfer /opt/featherweight/server/
    
    # Set appropriate permissions
    chmod +x /opt/featherweight/server/consciousness-startup-optimized.js
    chmod +x /opt/featherweight/server/consciousness-cluster-manager.js
    
    log_success "File permissions configured"
}

# Install optimized service
install_optimized_service() {
    log_info "Installing optimized consciousness service..."
    
    # Copy service file to systemd directory
    cp "/opt/featherweight/consciousness-optimized.service" "/etc/systemd/system/${OPTIMIZED_SERVICE_NAME}.service"
    
    # Reload systemd
    systemctl daemon-reload
    
    # Enable the service
    systemctl enable "$OPTIMIZED_SERVICE_NAME"
    
    log_success "Optimized service installed and enabled"
}

# Test optimized system
test_optimized_system() {
    log_info "Testing optimized consciousness system..."
    
    # Start the optimized service
    systemctl start "$OPTIMIZED_SERVICE_NAME"
    
    # Wait for startup
    sleep 10
    
    # Check if service is running
    if systemctl is-active --quiet "$OPTIMIZED_SERVICE_NAME"; then
        log_success "Optimized service started successfully"
        
        # Check CPU usage after optimization
        local new_pid=$(ps aux | grep consciousness-startup-optimized.js | grep -v grep | awk '{print $2}' | head -1)
        
        if [[ -n "$new_pid" ]]; then
            sleep 5 # Let it stabilize
            local new_cpu_usage=$(ps -p "$new_pid" -o pcpu= | tr -d ' ')
            log_info "Optimized consciousness process (PID: $new_pid) CPU usage: ${new_cpu_usage}%"
        fi
        
        # Test WebSocket connectivity
        log_info "Testing WebSocket connectivity..."
        timeout 10 curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==" http://localhost:3002/ > /dev/null 2>&1 && log_success "WebSocket test passed" || log_warning "WebSocket test failed"
        
    else
        log_error "Optimized service failed to start"
        return 1
    fi
}

# Monitor system performance
monitor_performance() {
    log_info "Monitoring system performance for 60 seconds..."
    
    local start_time=$(date +%s)
    local end_time=$((start_time + 60))
    
    while [[ $(date +%s) -lt $end_time ]]; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        # Get CPU and memory usage
        local cpu_usage=$(top -bn1 | grep "consciousness" | awk '{print $9}' | head -1)
        local mem_usage=$(top -bn1 | grep "consciousness" | awk '{print $10}' | head -1)
        
        echo -ne "\r⏱️  Monitoring: ${elapsed}s | CPU: ${cpu_usage}% | Memory: ${mem_usage}%"
        
        sleep 2
    done
    
    echo ""
    log_success "Performance monitoring completed"
}

# Generate deployment report
generate_report() {
    log_info "Generating deployment report..."
    
    local report_file="/opt/featherweight/cpu-optimization-deployment-report.txt"
    
    cat > "$report_file" << EOF
CPU Optimization Deployment Report
==================================
Date: $(date)
Backup Location: $BACKUP_DIR

System Information:
- CPU Cores: $(nproc)
- Available Memory: $(free -h | awk '/^Mem:/ {print $7}')
- Load Average: $(uptime | awk -F'load average:' '{print $2}')

Service Status:
- Original Service: $(systemctl is-active "$SERVICE_NAME" 2>/dev/null || echo "not found")
- Optimized Service: $(systemctl is-active "$OPTIMIZED_SERVICE_NAME" 2>/dev/null || echo "not found")

Process Information:
$(ps aux | grep consciousness | grep -v grep)

Optimization Features Enabled:
- Multi-core clustering: Yes
- Reduced frequency (10Hz): Yes
- User optimization (linode-transfer): Yes
- Resource limits: Yes
- Memory optimization: Yes

Next Steps:
1. Monitor CPU usage over the next hour
2. Check consciousness system functionality
3. Verify WebSocket connections are working
4. Monitor memory usage patterns

Rollback Instructions:
If issues occur, run:
sudo systemctl stop $OPTIMIZED_SERVICE_NAME
sudo systemctl start $SERVICE_NAME

For complete rollback:
sudo cp $BACKUP_DIR/${SERVICE_NAME}.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME
EOF

    log_success "Report saved to: $report_file"
}

# Main deployment function
main() {
    echo ""
    log_info "Starting CPU optimization deployment..."
    
    # Pre-deployment checks
    check_permissions
    check_current_cpu
    
    # Create backup
    create_backup
    
    # Stop current system
    stop_current_service
    
    # Setup optimizations
    setup_permissions
    install_optimized_service
    
    # Test new system
    if test_optimized_system; then
        log_success "Optimization deployment successful!"
        
        # Monitor performance
        monitor_performance
        
        # Generate report
        generate_report
        
        echo ""
        log_success "🎉 CPU Optimization Deployment Complete!"
        echo ""
        log_info "Key improvements:"
        echo "  • Multi-core processing distribution"
        echo "  • Reduced consciousness frequency (100Hz → 10Hz)"
        echo "  • Running under linode-transfer user"
        echo "  • Resource limits and monitoring"
        echo ""
        log_info "Monitor the system and check the report at:"
        echo "  /opt/featherweight/cpu-optimization-deployment-report.txt"
        
    else
        log_error "Optimization deployment failed!"
        log_info "Rolling back to original system..."
        
        systemctl stop "$OPTIMIZED_SERVICE_NAME" || true
        systemctl start "$SERVICE_NAME" || true
        
        log_warning "Rollback completed. Check logs for details."
        exit 1
    fi
}

# Run main function
main "$@"
