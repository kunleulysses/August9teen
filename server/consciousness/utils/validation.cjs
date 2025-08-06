const fs = require('fs');
const path = require('path');
const Ajv = require('ajv').default;

const SCHEMA_DIR = path.join(__dirname, '..', 'schemas');
const ajv = new Ajv({ allErrors: true, strict: false, $data: true });
let loadedSchemas = false;

function loadAllSchemas() {
  if (loadedSchemas) return;
  const files = fs.readdirSync(SCHEMA_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const schema = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, file), 'utf8'));
    ajv.addSchema(schema, file);
  }
  loadedSchemas = true;
}

/**
 * Validate with local, offline JSON schemas.
 * @param {string} schemaName - e.g. 'consciousness-state.json'
 * @param {object} obj
 */
function validate(schemaName, obj) {
  loadAllSchemas();
  const validate = ajv.getSchema(schemaName);
  if (!validate) throw new Error(`Schema not found: ${schemaName}`);
  if (!validate(obj)) {
    const msg = validate.errors.map(e => `${e.instancePath} ${e.message}`).join('; ');
    throw new Error('ValidationError: ' + msg);
  }
  return true;
}

module.exports = { validate };