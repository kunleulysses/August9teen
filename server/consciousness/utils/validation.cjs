const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
let addFormats;
try { addFormats = require('ajv-formats'); } catch (_) { addFormats = () => {}; }

const schemasDir = path.join(__dirname, '../schemas');
const ajv = new Ajv({ allErrors: true, coerceTypes: true });
try { addFormats(ajv); } catch (_) {}

fs.readdirSync(schemasDir).forEach((file) => {
  if (file.endsWith('.json')) {
    try {
      const schema = require(path.join(schemasDir, file));
      try {
        if (schema && schema.$id && !ajv.getSchema(schema.$id)) {
          ajv.addSchema(schema, schema.$id);
        }
      } catch (_) { /* ignore duplicate schema adds */ }
    } catch (e) {
      // Skip invalid JSON schema files (e.g., truncated during development)
    }
  }
});

function validate(schemaKey, data) {
  if (!ajv.validate(schemaKey, data)) {
    throw new Error('SchemaValidationError:' + ajv.errorsText());
  }
}

module.exports = { validate };
