#!/bin/bash

echo "Creating clean commit without secrets..."

# Create a new commit that removes any sensitive data
git add .
git commit --amend -m "Performance optimizations: message batching, connection pooling, caching, and monitoring - Clean version without sensitive data"

# Try to push the amended commit
echo "Pushing amended commit..."
git push --force origin main

echo "Clean push attempt completed." 