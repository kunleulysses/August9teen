const { promises as fs  } = require('fs');
const { fileURLToPath  } = require('url');
const { dirname, join  } = require('path');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fixAutoIntegrationInit() {
    console.log('🔧 Fixing AutoIntegrationService initialization...');
    
    const filePath = join(__dirname, 'consciousness-system-v2.cjs');
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Remove the incorrect initialize call
    content = content.replace(
        'await autoIntegration.initialize(); // Enable auto-integration',
        '// AutoIntegrationService is ready on instantiation'
    );
    
    // Save the fixed file
    await fs.writeFile(filePath, content);
    
    console.log('✅ Fixed! AutoIntegrationService will be ready on instantiation.');
}

fixAutoIntegrationInit().catch(console.error);
