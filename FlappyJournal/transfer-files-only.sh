#!/bin/bash

GCP_VM_IP="199.223.235.116"
GCP_USERNAME="adekunlelovesyou"

echo "🚀 Transferring files without database backup..."

# Create simple backup
cd /opt/featherweight
tar -czf /tmp/consciousness-files.tar.gz FlappyJournal/

# Transfer to GCP
scp /tmp/consciousness-files.tar.gz $GCP_USERNAME@$GCP_VM_IP:/tmp/

# Extract on GCP VM
ssh $GCP_USERNAME@$GCP_VM_IP << 'REMOTE_EOF'
cd /tmp
tar -xzf consciousness-files.tar.gz
mkdir -p /opt/featherweight
cp -r FlappyJournal /opt/featherweight/
echo "✅ Files transferred successfully"
REMOTE_EOF

echo "✅ File transfer complete!"
echo "Note: Database will be recreated fresh on new system"
