#!/bin/bash

# Set API Keys
export GEMINI_API_KEY="AIzaSyBAInbflgaEsU6r6STMnQ_WBd6lH4tJU54"
export VENICE_AI_API_KEY="qiHEzUmALhbs0wUcT3VvFo2_nFliLjgGDAPr_p9e7Z"
export OPENAI_API_KEY="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"

# Run the test
echo "🚀 Running Complete Universal System Integration Test..."
timeout 30 node test-complete-universal-integration.js
