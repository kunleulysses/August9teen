#!/bin/bash

echo "🚀 Starting August9teen Landing Page..."

# Navigate to the august9teen-landing directory
cd /opt/featherweight/august9teen-landing

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "✅ Node.js found. Starting server..."
    node server.js
else
    echo "❌ Node.js not found. Trying Python..."
    if command -v python3 &> /dev/null; then
        echo "✅ Python3 found. Starting server..."
        python3 -m http.server 3000
    elif command -v python &> /dev/null; then
        echo "✅ Python found. Starting server..."
        python -m SimpleHTTPServer 3000
    else
        echo "❌ Neither Node.js nor Python found."
        echo "💡 Install Node.js: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
        exit 1
    fi
fi 