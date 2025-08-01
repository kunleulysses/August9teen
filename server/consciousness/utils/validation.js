const fs = require('fs');
const path = require('path');
const Ajv = require('ajv').default;
const addFormats = require('ajv-formats');

const schemasDir = path.join(__dirname, '../schemas');
const ajv = new Ajv({ allErrors: true, coerceTypes: true });
addFormats(ajv);

fs.readdirSync(schemasDir).forEach((file) => {
  if (file.endsWith('.json')) {
    const schema = require(path.join(schemasDir, file));
    ajv.addSchema(schema, schema.$id);
  }
});

function validate(schemaKey, data) {
  if (!ajv.validate(schemaKey, data)) {
    throw new Error('SchemaValidationError:' + ajv.errorsText());
  }
}

module.exports = { validate };