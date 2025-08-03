import fs from 'fs';

let content = fs.readFileSync('./enhanced-dual-consciousness-ws.cjs', 'utf8');

// Add import for simple processor
content = content.replace(
  'import { createEnhancedDualConsciousnessWS } from "./dual-consciousness-ws.cjs";',
  `import { createEnhancedDualConsciousnessWS } from "./dual-consciousness-ws.cjs";
import { SimpleConsciousnessProcessor } from "./simple-consciousness-processor.cjs";`
);

// Replace the consciousness processor
content = content.replace(
  'const consciousness = dualStreamIntegration;',
  `// const consciousness = dualStreamIntegration;
    const consciousness = new SimpleConsciousnessProcessor();`
);

fs.writeFileSync('./enhanced-dual-consciousness-ws.cjs', content);
console.log('Updated to use simple consciousness processor');
