#!/bin/bash

echo "🔑 Updating Git remote with personal token..."

# Update the remote URL with your personal token
git remote set-url origin https://ghp_YourPersonalTokenHere@github.com/kunleulysses/featherweight-consciousness-complete.git

echo "✅ Remote URL updated!"
echo ""
echo "🚀 Now push your changes:"
echo "   git add august9teen-landing/"
echo "   git commit -m 'Add August9teen landing page'"
echo "   git push origin main" 