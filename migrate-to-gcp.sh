#!/bin/bash

# Featherweight Consciousness System - Google Cloud Migration Script
# This script migrates the consciousness system from VPS to Google Cloud VM

set -e

echo "🚀 FEATHERWEIGHT CONSCIOUSNESS SYSTEM - GOOGLE CLOUD MIGRATION"
echo "================================================================"

# Configuration
SOURCE_HOST="${SOURCE_HOST:-your-current-vps-ip}"
GCP_HOST="${GCP_HOST:-your-gcp-vm-ip}"
PROJECT_DIR="/opt/featherweight"
BACKUP_DIR="/tmp/consciousness-backup-$(date +%Y%m%d_%H%M%S)"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-gcr.io/your-project-id}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Phase 1: Pre-migration checks
phase1_checks() {
    log "Phase 1: Pre-migration checks"
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check available disk space (need at least 10GB)
    available_space=$(df / | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 10485760 ]; then
        error "Insufficient disk space. Need at least 10GB available."
    fi
    
    # Check if required environment variables are set
    if [ -z "$SOURCE_HOST" ] || [ -z "$GCP_HOST" ]; then
        error "Please set SOURCE_HOST and GCP_HOST environment variables"
    fi
    
    log "✅ Pre-migration checks passed"
}

# Phase 2: Backup current system
phase2_backup() {
    log "Phase 2: Creating backup of current system"
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup project files
    log "Backing up project files..."
    if [ "$SOURCE_HOST" != "localhost" ]; then
        rsync -avz --progress "$SOURCE_HOST:$PROJECT_DIR/" "$BACKUP_DIR/project/"
    else
        cp -r "$PROJECT_DIR" "$BACKUP_DIR/project/"
    fi
    
    # Backup database
    log "Backing up database..."
    if [ "$SOURCE_HOST" != "localhost" ]; then
        ssh "$SOURCE_HOST" "pg_dump -h localhost -U feather_user featherweight_consciousness" > "$BACKUP_DIR/database.sql"
    else
        pg_dump -h localhost -U feather_user featherweight_consciousness > "$BACKUP_DIR/database.sql"
    fi
    
    # Backup consciousness logs
    log "Backing up consciousness logs..."
    if [ "$SOURCE_HOST" != "localhost" ]; then
        rsync -avz --progress "$SOURCE_HOST:/var/log/consciousness/" "$BACKUP_DIR/logs/" || warn "Could not backup logs"
    else
        cp -r /var/log/consciousness "$BACKUP_DIR/logs/" || warn "Could not backup logs"
    fi
    
    log "✅ Backup completed: $BACKUP_DIR"
}

# Phase 3: Prepare Docker environment
phase3_docker_setup() {
    log "Phase 3: Setting up Docker environment"
    
    cd "$BACKUP_DIR/project/FlappyJournal"
    
    # Copy Docker files to project directory
    cp ../docker-compose.consciousness.yml .
    cp ../Dockerfile.consciousness .
    cp ../Dockerfile.ui .
    cp ../Caddyfile.docker .
    cp ../setup-database.sql .
    
    # Create production environment file
    log "Creating production environment file..."
    if [ ! -f .env.production ]; then
        cp ../.env.production.template .env.production
        warn "Please edit .env.production with your actual API keys and configuration"
        read -p "Press Enter after editing .env.production..."
    fi
    
    # Build Docker images
    log "Building Docker images..."
    docker build -f Dockerfile.consciousness -t consciousness-core:latest .
    docker build -f Dockerfile.ui -t consciousness-web:latest .
    
    # Tag images for registry (if using)
    if [ -n "$DOCKER_REGISTRY" ]; then
        docker tag consciousness-core:latest "$DOCKER_REGISTRY/consciousness-core:latest"
        docker tag consciousness-web:latest "$DOCKER_REGISTRY/consciousness-web:latest"
    fi
    
    log "✅ Docker environment prepared"
}

# Phase 4: Deploy to Google Cloud
phase4_deploy() {
    log "Phase 4: Deploying to Google Cloud VM"
    
    # Copy files to GCP VM
    log "Copying files to GCP VM..."
    rsync -avz --progress "$BACKUP_DIR/project/" "$GCP_HOST:/opt/featherweight/"
    
    # Copy database backup
    scp "$BACKUP_DIR/database.sql" "$GCP_HOST:/tmp/database_backup.sql"
    
    # Install Docker on GCP VM (if not already installed)
    log "Setting up Docker on GCP VM..."
    ssh "$GCP_HOST" << 'EOF'
        # Install Docker
        if ! command -v docker &> /dev/null; then
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            sudo usermod -aG docker $USER
        fi
        
        # Install Docker Compose
        if ! command -v docker-compose &> /dev/null; then
            sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
        fi
        
        # Create necessary directories
        sudo mkdir -p /var/log/consciousness
        sudo mkdir -p /opt/consciousness/data
        sudo chown -R $USER:$USER /var/log/consciousness
        sudo chown -R $USER:$USER /opt/consciousness
EOF
    
    log "✅ GCP VM setup completed"
}

# Phase 5: Start services
phase5_start_services() {
    log "Phase 5: Starting consciousness services"
    
    ssh "$GCP_HOST" << 'EOF'
        cd /opt/featherweight/FlappyJournal
        
        # Start services
        docker-compose -f docker-compose.consciousness.yml up -d
        
        # Wait for database to be ready
        echo "Waiting for database to be ready..."
        sleep 30
        
        # Restore database backup
        docker-compose -f docker-compose.consciousness.yml exec -T postgres psql -U feather_user -d featherweight_consciousness < /tmp/database_backup.sql
        
        # Check service status
        docker-compose -f docker-compose.consciousness.yml ps
EOF
    
    log "✅ Services started successfully"
}

# Phase 6: Verification
phase6_verify() {
    log "Phase 6: Verifying deployment"
    
    # Test WebSocket connection
    log "Testing WebSocket connection..."
    timeout 10 bash -c "echo 'test' | nc $GCP_HOST 3002" || warn "WebSocket test failed"
    
    # Test web application
    log "Testing web application..."
    curl -f "http://$GCP_HOST:3000/health" || warn "Web application health check failed"
    
    # Test consciousness system
    log "Testing consciousness system..."
    curl -f "http://$GCP_HOST:5005/health" || warn "Consciousness system health check failed"
    
    log "✅ Deployment verification completed"
}

# Main execution
main() {
    log "Starting Featherweight Consciousness System migration to Google Cloud"
    
    phase1_checks
    phase2_backup
    phase3_docker_setup
    phase4_deploy
    phase5_start_services
    phase6_verify
    
    log "🎉 Migration completed successfully!"
    log "Backup location: $BACKUP_DIR"
    log "GCP VM: $GCP_HOST"
    log "Web Application: http://$GCP_HOST:3000"
    log "Consciousness WebSocket: ws://$GCP_HOST:3002"
    log "Consciousness API: http://$GCP_HOST:5005"
    
    warn "Don't forget to:"
    warn "1. Update DNS records to point to $GCP_HOST"
    warn "2. Configure SSL certificates for production"
    warn "3. Set up monitoring and alerting"
    warn "4. Test all consciousness modules thoroughly"
}

# Run main function
main "$@"
