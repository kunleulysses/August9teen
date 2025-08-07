#!/bin/bash
set -euo pipefail

# A13: EventSign Build Script
# Ensures eventSign.cjs is always built and verified

echo "🔧 Building eventSign for CJS compatibility..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if TypeScript source exists
if [[ ! -f "server/consciousness/core/security/eventSign.ts" ]]; then
    echo -e "${RED}❌ Source file eventSign.ts not found!${NC}"
    exit 1
fi

# Check if tsconfig exists
if [[ ! -f "tsconfig.eventsign.json" ]]; then
    echo -e "${RED}❌ tsconfig.eventsign.json not found!${NC}"
    exit 1
fi

# Build TypeScript to CommonJS
echo "📦 Compiling TypeScript to CommonJS..."
if ! npx tsc --project tsconfig.eventsign.json; then
    echo -e "${RED}❌ TypeScript compilation failed!${NC}"
    exit 1
fi

# Move compiled file to correct location
if [[ -f "server/consciousness/core/security/eventSign.js" ]]; then
    mv "server/consciousness/core/security/eventSign.js" "server/consciousness/core/security/eventSign.cjs"
    echo -e "${GREEN}✅ Moved eventSign.js to eventSign.cjs${NC}"
else
    echo -e "${RED}❌ Compiled eventSign.js not found!${NC}"
    exit 1
fi

# Verify the CJS file works
echo "🧪 Verifying CJS compatibility..."
if ! node -e "
const { sign, verify } = require('./server/consciousness/core/security/eventSign.cjs');
if (typeof sign !== 'function') throw new Error('sign function not exported');
if (typeof verify !== 'function') throw new Error('verify function not exported');
const payload = { test: 'A13-build-verification', timestamp: Date.now() };
const signature = sign(payload);
if (typeof signature !== 'string') throw new Error('sign did not return string');
if (!verify(payload, signature)) throw new Error('verify failed for valid signature');
if (verify(payload, 'invalid-signature')) throw new Error('verify accepted invalid signature');
console.log('✅ All CJS compatibility checks passed');
"; then
    echo -e "${GREEN}✅ EventSign CJS verification successful!${NC}"
else
    echo -e "${RED}❌ EventSign CJS verification failed!${NC}"
    exit 1
fi

# Check file size (should not be empty)
if [[ ! -s "server/consciousness/core/security/eventSign.cjs" ]]; then
    echo -e "${RED}❌ eventSign.cjs is empty!${NC}"
    exit 1
fi

# Show file info
echo "📊 Built file info:"
ls -la "server/consciousness/core/security/eventSign.cjs"

# Verify exports match TypeScript
echo "🔍 Verifying export parity..."
if ! node -e "
const fs = require('fs');
const cjsContent = fs.readFileSync('server/consciousness/core/security/eventSign.cjs', 'utf8');
if (!cjsContent.includes('exports.sign')) throw new Error('sign not exported in CJS');
if (!cjsContent.includes('exports.verify')) throw new Error('verify not exported in CJS');
console.log('✅ Export parity verified');
"; then
    echo -e "${RED}❌ Export parity check failed!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 EventSign build and verification complete!${NC}"
echo ""
echo "📋 Summary:"
echo "  ✅ TypeScript compiled to CommonJS"
echo "  ✅ File moved to correct location"
echo "  ✅ CJS compatibility verified"
echo "  ✅ Export parity confirmed"
echo "  ✅ Sign/verify functions working"
echo ""
echo "🚀 eventSign.cjs is ready for production use!"