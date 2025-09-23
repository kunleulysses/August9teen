#!/bin/bash

# Require API keys from environment
if [ -z "${GEMINI_API_KEY:-}" ] || [ -z "${VENICE_AI_API_KEY:-}" ] || [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "❌ Set GEMINI_API_KEY, VENICE_AI_API_KEY, and OPENAI_API_KEY in your environment before running." >&2
  exit 1
fi

# Run the test
echo "🚀 Running Complete Universal System Integration Test..."
timeout 30 node test-complete-universal-integration.js
