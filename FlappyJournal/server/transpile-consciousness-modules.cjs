const fs = require('fs');
const path = require('path');

// For now, we'll create JavaScript versions of the key modules
// In production, you'd use proper TypeScript compilation

console.log('📝 Creating JavaScript versions of consciousness modules...');

// List of modules to convert
const modules = [
  'ConsciousnessEventBus',
  'SelfHealingModule', 
  'ModuleOrchestrator',
  'ConsciousnessPersistence',
  'AutonomousGoalSystem',
  'SelfCodingEngine'
];

// Storage adapter modules to convert
const storageModules = [
  'RedisSpiralAdapter',
  'LevelSpiralAdapter', 
  'RedisClusterSpiralAdapter',
  'SpiralStorageAdapter'
];

// Basic TypeScript to JavaScript conversion (simplified)
function convertTypeScriptToJavaScript(content) {
  // Remove TypeScript-specific syntax
  let jsContent = content
    // Convert import statements first
    .replace(/import\s+{([^}]+)}\s+from\s+'([^']+)'/g, "const {$1} = require('$2')")
    .replace(/import\s+(\w+)\s+from\s+'([^']+)'/g, "const $1 = require('$2')")
    // Remove interface definitions
    .replace(/export\s+interface\s+\w+\s*{[^}]+}/gs, '')
    .replace(/interface\s+\w+\s*{[^}]+}/gs, '')
    // Remove type exports
    .replace(/export\s+type\s+[^;]+;/g, '')
    // Remove generic type parameters
    .replace(/<[^>]+>/g, '')
    // Convert public/private/protected to nothing
    .replace(/\b(public|private|protected)\s+/g, '')
    // Remove readonly
    .replace(/\breadonly\s+/g, '')
    // Remove TypeScript property declarations (like "private redisUrl: string;")
    .replace(/^\s*(private|public|protected)?\s*\w+\s*:\s*[^;=]+;?\s*$/gm, '')
    .replace(/^\s*\w+\s*\|\s*\w+;\s*$/gm, '')
    .replace(/^\s*\w+;\s*$/gm, '')
    // Remove type annotations from parameters and return types
    .replace(/:\s*Promise<[^>]+>/g, '')
    .replace(/:\s*\w+(\[\])?/g, '')
    .replace(/:\s*{[^}]+}/g, '')
    .replace(/:\s*\([^)]+\)\s*=>/g, '')
    // Remove 'as' type assertions
    .replace(/\s+as\s+\w+/g, '')
    // Fix variable declarations that got mangled
    .replace(/let\s+val\s*;/g, 'let val;')
    // Fix object destructuring in JSON.stringify
    .replace(/JSON\.stringify\(\{\s*__enc\s*\}\)/, 'JSON.stringify({ __enc: enc })')
    // Export statements - handle export default first
    .replace(/export\s+default\s+(\w+);?/g, 'module.exports = $1;')
    .replace(/export\s+const\s+/g, 'module.exports.')
    .replace(/export\s+class\s+/g, 'class ')
    .replace(/export\s+{([^}]+)}/g, 'module.exports = {$1}');

  // Add module.exports for classes if export default was used
  const classMatch = jsContent.match(/class\s+(\w+)/);
  if (classMatch && jsContent.includes('module.exports =')) {
    // Already has module.exports, don't add duplicate
  } else if (classMatch) {
    const className = classMatch[1];
    if (!jsContent.includes(`module.exports.${className}`)) {
      jsContent += `\n\nmodule.exports.${className} = ${className};`;
    }
  }

  return jsContent;
}

// Process each module
modules.forEach(moduleName => {
  const tsFile = path.join(__dirname, `${moduleName}.ts`);
  const jsFile = path.join(__dirname, `${moduleName}.js`);
  
  if (fs.existsSync(tsFile)) {
    console.log(`Converting ${moduleName}.ts to .js...`);
    const tsContent = fs.readFileSync(tsFile, 'utf8');
    const jsContent = convertTypeScriptToJavaScript(tsContent);
    fs.writeFileSync(jsFile, jsContent);
    console.log(`✅ Created ${moduleName}.js`);
  } else {
    console.log(`⚠️  ${moduleName}.ts not found`);
  }
});

// Process storage adapter modules
const storageDir = path.join(__dirname, 'consciousness/core/storage');
storageModules.forEach(moduleName => {
  const tsFile = path.join(storageDir, `${moduleName}.ts`);
  const jsFile = path.join(storageDir, `${moduleName}.js`);
  
  if (fs.existsSync(tsFile)) {
    console.log(`Converting storage/${moduleName}.ts to .js...`);
    const tsContent = fs.readFileSync(tsFile, 'utf8');
    const jsContent = convertTypeScriptToJavaScript(tsContent);
    fs.writeFileSync(jsFile, jsContent);
    console.log(`✅ Created storage/${moduleName}.js`);
  } else {
    console.log(`⚠️  storage/${moduleName}.ts not found`);
  }
});

console.log('\n✅ Module conversion complete!');
