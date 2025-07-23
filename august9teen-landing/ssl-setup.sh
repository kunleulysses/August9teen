#!/bin/bash

echo "🔒 Setting up SSL/HTTPS for August9teen.com..."

# Install Certbot for Let's Encrypt SSL
echo "📦 Installing Certbot..."
apt update
apt install -y certbot

# Check if we have a domain configured
echo "🌐 Checking domain configuration..."
if [ -z "$DOMAIN" ]; then
    echo "❌ No domain specified. Set DOMAIN environment variable:"
    echo "   export DOMAIN=august9teen.com"
    echo "   Then run this script again."
    exit 1
fi

# Create Nginx configuration
echo "📝 Creating Nginx configuration..."
cat > /etc/nginx/sites-available/august9teen.com << EOF
server {
    listen 80;
    server_name august9teen.com www.august9teen.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/august9teen.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Get SSL certificate
echo "🔐 Getting SSL certificate from Let's Encrypt..."
certbot --nginx -d august9teen.com -d www.august9teen.com --non-interactive --agree-tos --email arrival@august9teen.com

echo "✅ SSL setup complete!"
echo "🌐 Your website should now be accessible at: https://august9teen.com" 