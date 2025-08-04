#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to convert ES6 import/export statements to CommonJS require/module.exports
 * in .cjs files to fix the "Cannot use import statement outside a module" error
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

function convertImportsToRequires(content) {
    // Convert named imports: import { foo, bar } from 'module'
    content = content.replace(
        /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"]\s*;?/g,
        'const { $1 } = require(\'$2\');'
    );
    
    // Convert default imports: import foo from 'module'
    content = content.replace(
        /import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
        'const $1 = require(\'$2\');'
    );
    
    // Convert namespace imports: import * as foo from 'module'
    content = content.replace(
        /import\s*\*\s*as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
        'const $1 = require(\'$2\');'
    );
    
    // Convert side-effect imports: import 'module'
    content = content.replace(
        /import\s*['"]([^'"]+)['"]\s*;?/g,
        'require(\'$1\');'
    );
    
    return content;
}

function convertExportsToModuleExports(content) {
    // Convert default exports: export default foo
    content = content.replace(
        /export\s+default\s+([^;]+);?/g,
        'module.exports = $1;'
    );
    
    // Convert named exports: export { foo, bar }
    content = content.replace(
        /export\s*\{\s*([^}]+)\s*\}\s*;?/g,
        (match, exports) => {
            const exportList = exports.split(',').map(e => e.trim());
            return exportList.map(exp => `module.exports.${exp} = ${exp};`).join('\n');
        }
    );
    
    // Convert export const/let/var: export const foo = bar
    content = content.replace(
        /export\s+(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([^;]+);?/g,
        '$1 $2 = $3;\nmodule.exports.$2 = $2;'
    );
    
    // Convert export function: export function foo() {}
    content = content.replace(
        /export\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*\{/g,
        (match, funcName) => {
            const replacement = match.replace('export ', '');
            return replacement + '\nmodule.exports.' + funcName + ' = ' + funcName + ';\n';
        }
    );
    
    // Convert export class: export class Foo {}
    content = content.replace(
        /export\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
        (match, className) => {
            const replacement = match.replace('export ', '');
            return replacement + '\nmodule.exports.' + className + ' = ' + className + ';\n';
        }
    );
    
    return content;
}

function fixCjsFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Check if file has ES6 imports/exports
        const hasImports = /import\s+/.test(content);
        const hasExports = /export\s+/.test(content);
        
        if (!hasImports && !hasExports) {
            return false; // No changes needed
        }
        
        console.log(`Fixing ${filePath}...`);
        
        // Convert imports first
        content = convertImportsToRequires(content);
        
        // Then convert exports
        content = convertExportsToModuleExports(content);
        
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

console.log('Finding .cjs files with ES6 imports/exports...');
const cjsFiles = findCjsFiles(flappyDir);

console.log(`Found ${cjsFiles.length} .cjs files`);

let fixedCount = 0;
for (const file of cjsFiles) {
    if (fixCjsFile(file)) {
        fixedCount++;
    }
}

console.log(`\nFixed ${fixedCount} files with ES6 import/export issues`);
console.log('All .cjs files should now use CommonJS syntax');
