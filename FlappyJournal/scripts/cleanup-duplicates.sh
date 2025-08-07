#!/bin/bash
set -euo pipefail

# A11: Duplicate File Cleanup Script
# Systematically removes duplicate, backup, and stale sigil-related files

echo "🧹 Starting Sigil-DNA Duplicate File Cleanup (A11)"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Dry run flag
DRY_RUN=${1:-"--dry-run"}

# Canonical files that should be kept
CANONICAL_FILES=(
    "server/sigil-identity.cjs"
    "server/sigil-api.cjs" 
    "server/consciousness/sigil-based-code-authenticator.cjs"
    "server/consciousness/persistence/LevelDBSigilAdapter.cjs"
    "server/metrics/sigilMetrics.cjs"
)

# Files/patterns to remove
REMOVE_PATTERNS=(
    "FlappyJournal hey/"
    "system-backups/"
    "*.bak"
    "*.backup" 
    "*.orig"
    "*-pre-sigil*"
    "test-*sigil*"
    "simple-*sigil*"
    "comprehensive-*sigil*"
    "add-sigil-*"
    "update*sigil*"
    "integrate-sigil*"
)

# Function to check if file is canonical
is_canonical() {
    local file="$1"
    for canonical in "${CANONICAL_FILES[@]}"; do
        if [[ "$file" == *"$canonical" ]]; then
            return 0
        fi
    done
    return 1
}

# Find all sigil-related files
echo "🔍 Scanning for sigil-related files..."
ALL_SIGIL_FILES=$(find . -type f -iname '*sigil*' | grep -v node_modules | grep -v .git | sort)

echo "📋 Found sigil-related files:"
echo "$ALL_SIGIL_FILES"
echo ""

# Categorize files
CANONICAL_FOUND=()
DUPLICATES_TO_REMOVE=()
TESTS_TO_KEEP=()

while IFS= read -r file; do
    if [[ -z "$file" ]]; then continue; fi
    
    # Skip test files in __tests__ directory (keep these)
    if [[ "$file" == *"__tests__"* ]]; then
        TESTS_TO_KEEP+=("$file")
        continue
    fi
    
    # Check if canonical
    if is_canonical "$file"; then
        CANONICAL_FOUND+=("$file")
        echo -e "${GREEN}✓ KEEP (canonical):${NC} $file"
    else
        # Check if matches removal patterns
        should_remove=false
        for pattern in "${REMOVE_PATTERNS[@]}"; do
            if [[ "$file" == *"$pattern"* ]] || [[ "$file" == $pattern ]]; then
                should_remove=true
                break
            fi
        done
        
        if $should_remove; then
            DUPLICATES_TO_REMOVE+=("$file")
            echo -e "${RED}✗ REMOVE (duplicate/backup):${NC} $file"
        else
            echo -e "${YELLOW}? REVIEW (unknown):${NC} $file"
        fi
    fi
done <<< "$ALL_SIGIL_FILES"

echo ""
echo "📊 Summary:"
echo "  Canonical files found: ${#CANONICAL_FOUND[@]}"
echo "  Test files to keep: ${#TESTS_TO_KEEP[@]}"
echo "  Files to remove: ${#DUPLICATES_TO_REMOVE[@]}"
echo ""

# Show what will be removed
if [[ ${#DUPLICATES_TO_REMOVE[@]} -gt 0 ]]; then
    echo "🗑️  Files scheduled for removal:"
    for file in "${DUPLICATES_TO_REMOVE[@]}"; do
        echo "    $file"
    done
    echo ""
fi

# Check for import references
echo "🔍 Checking for import references to files being removed..."
PROBLEMATIC_IMPORTS=()

for file in "${DUPLICATES_TO_REMOVE[@]}"; do
    # Extract filename without path
    filename=$(basename "$file")
    base_name="${filename%.*}"
    
    # Search for imports/requires
    if grep -r "require.*$base_name" . --exclude-dir=node_modules --exclude-dir=.git >/dev/null 2>&1; then
        PROBLEMATIC_IMPORTS+=("$file")
        echo -e "${RED}⚠️  WARNING: Found imports for $file${NC}"
        grep -r "require.*$base_name" . --exclude-dir=node_modules --exclude-dir=.git | head -3
    fi
done

if [[ ${#PROBLEMATIC_IMPORTS[@]} -gt 0 ]]; then
    echo -e "${RED}❌ ABORT: Found imports to files being removed!${NC}"
    echo "Please update imports first, then re-run this script."
    exit 1
fi

# Execute removal
if [[ "$DRY_RUN" == "--execute" ]]; then
    echo "🚀 Executing file removal..."
    
    for file in "${DUPLICATES_TO_REMOVE[@]}"; do
        if [[ -f "$file" ]]; then
            echo "Removing: $file"
            git rm "$file" 2>/dev/null || rm "$file"
        fi
    done
    
    # Commit changes
    if git status --porcelain | grep -q "D "; then
        git add -A
        git commit -m "A11: Remove duplicate/backup sigil implementations

- Removed ${#DUPLICATES_TO_REMOVE[@]} duplicate/backup files
- Kept canonical implementations in server/
- Preserved test files in __tests__/
- Verified no broken imports"
        
        echo -e "${GREEN}✅ Cleanup complete! Changes committed.${NC}"
    else
        echo "No files were actually removed."
    fi
    
else
    echo -e "${YELLOW}🔍 DRY RUN MODE${NC}"
    echo "To execute the cleanup, run:"
    echo "  $0 --execute"
    echo ""
    echo "This will:"
    echo "  1. Remove ${#DUPLICATES_TO_REMOVE[@]} duplicate/backup files"
    echo "  2. Keep ${#CANONICAL_FOUND[@]} canonical files"
    echo "  3. Preserve ${#TESTS_TO_KEEP[@]} test files"
    echo "  4. Commit changes with descriptive message"
fi

echo ""
echo "🎯 Canonical files that will remain:"
for file in "${CANONICAL_FOUND[@]}"; do
    echo "  ✓ $file"
done

echo ""
echo "✨ A11 Duplicate Cleanup Analysis Complete!"