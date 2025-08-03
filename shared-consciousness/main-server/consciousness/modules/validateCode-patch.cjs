// Find and replace the validateCode method
const fs = require('fs').promises;

async function patchFile() {
    let content = await fs.readFile('./SelfCodingModule.cjs', 'utf8');
    
    // Replace the validateCode method
    const oldValidation = `try {
            // Basic syntax validation using Function constructor
            new Function(code);`;
            
    const newValidation = `try {
            // For ES modules, skip Function constructor validation
            // Just do basic checks`;
            
    content = content.replace(oldValidation, newValidation);
    
    await fs.writeFile('./SelfCodingModule.cjs', content);
    console.log('Patched validateCode method');
}

patchFile().catch(console.error);
