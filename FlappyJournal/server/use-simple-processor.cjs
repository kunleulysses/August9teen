const fs = require('fs');

let content = fs.readFileSync('./enhanced-dual-consciousness-ws.cjs', 'utf8');

// Add import for simple processor
content = content.replace(
  'const { createEnhancedDualConsciousnessWS  } = require('./dual-consciousness-ws.cjs');',
  `const { createEnhancedDualConsciousnessWS  } = require('./dual-consciousness-ws.cjs');
const { SimpleConsciousnessProcessor  } = require('./simple-consciousness-processor.cjs');`
);

// Replace the consciousness processor
content = content.replace(
  'const consciousness = dualStreamIntegration;',
  `// const consciousness = dualStreamIntegration;
    const consciousness = new SimpleConsciousnessProcessor();`
);

fs.writeFileSync('./enhanced-dual-consciousness-ws.cjs', content);
console.log('Updated to use simple consciousness processor');
