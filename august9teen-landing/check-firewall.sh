#!/bin/bash

echo "🔒 Checking VPS firewall configuration..."

# Check if ufw is active
if command -v ufw &> /dev/null; then
    echo "✅ UFW firewall detected"
    echo "Current UFW status:"
    ufw status
    
    echo ""
    echo "🔓 To allow web traffic, run:"
    echo "   sudo ufw allow 3001"
    echo "   sudo ufw allow 8080"
    echo "   sudo ufw allow 8081"
fi

# Check if iptables is being used
if command -v iptables &> /dev/null; then
    echo ""
    echo "✅ iptables detected"
    echo "To allow web traffic, run:"
    echo "   sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT"
    echo "   sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT"
    echo "   sudo iptables -A INPUT -p tcp --dport 8081 -j ACCEPT"
fi

echo ""
echo "🌐 Your VPS IP addresses:"
echo "   Public IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Could not determine')"
echo "   Local IP: $(hostname -I | awk '{print $1}' 2>/dev/null || echo 'Could not determine')" 