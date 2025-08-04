#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to fix malformed module.exports statements that were incorrectly placed
 * in the middle of class declarations by the previous conversion script
 */

function findCjsFiles(dir) {
    const files = [];
    
    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.cjs')) {
                files.push(fullPath);
            }
        }
    }
    
    traverse(dir);
    return files;
}

function fixModuleExports(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Pattern to find malformed class declarations with module.exports in the middle
        const malformedClassPattern = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\nmodule\.exports\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([a-zA-Z_$][a-zA-Z0-9_$]*);?\s*\n\s*extends\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        
        let hasChanges = false;
        
        // Fix malformed class declarations
        content = content.replace(malformedClassPattern, (match, className, exportName, exportValue, parentClass) => {
            console.log(`Fixing malformed class declaration in ${filePath}: ${className}`);
            hasChanges = true;
            return `class ${className} extends ${parentClass}`;
        });
        
        // Remove standalone module.exports.ClassName = ClassName; lines that are not at the end
        const lines = content.split('\n');
        const fixedLines = [];
        const moduleExportsLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Check if this is a standalone module.exports line
            const moduleExportMatch = trimmedLine.match(/^module\.exports\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([a-zA-Z_$][a-zA-Z0-9_$]*);?$/);
            
            if (moduleExportMatch) {
                // Check if this line is in the middle of a class or function
                const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
                const prevLine = i > 0 ? lines[i - 1].trim() : '';
                
                // If the next line starts with 'extends', 'implements', '{', or is part of a class/function body
                if (nextLine.match(/^(extends|implements|\{|constructor|[a-zA-Z_$].*\(.*\)\s*\{)/)) {
                    console.log(`Removing misplaced module.exports line in ${filePath}: ${trimmedLine}`);
                    hasChanges = true;
                    // Store it to potentially add at the end
                    moduleExportsLines.push(trimmedLine);
                    continue; // Skip this line
                }
                
                // If the previous line is part of a class declaration
                if (prevLine.match(/^class\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*$/)) {
                    console.log(`Removing misplaced module.exports line in ${filePath}: ${trimmedLine}`);
                    hasChanges = true;
                    moduleExportsLines.push(trimmedLine);
                    continue; // Skip this line
                }
            }
            
            fixedLines.push(line);
        }
        
        if (hasChanges) {
            content = fixedLines.join('\n');
            
            // Check if there's already a proper module.exports at the end
            const hasProperExport = content.match(/module\.exports\s*=\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*;?\s*$/);
            
            if (!hasProperExport && moduleExportsLines.length > 0) {
                // Try to determine the main class name from the file
                const classMatch = content.match(/class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
                if (classMatch) {
                    const className = classMatch[1];
                    content += `\nmodule.exports = ${className};\n`;
                    console.log(`Added proper module.exports for ${className} in ${filePath}`);
                }
            }
        }
        
        // Only write if content changed
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Main execution
const flappyDir = './FlappyJournal';

if (!fs.existsSync(flappyDir)) {
    console.error('FlappyJournal directory not found:', flappyDir);
    process.exit(1);
}

console.log('Finding .cjs files with malformed module.exports...');
const cjsFiles = findCjsFiles(flappyDir);

console.log(`Found ${cjsFiles.length} .cjs files`);

let fixedCount = 0;
for (const file of cjsFiles) {
    if (fixModuleExports(file)) {
        fixedCount++;
    }
}

console.log(`\nFixed ${fixedCount} files with malformed module.exports`);
console.log('All .cjs files should now have proper CommonJS syntax');
