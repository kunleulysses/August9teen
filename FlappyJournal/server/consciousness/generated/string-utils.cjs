// Auto-generated utility functions

function camelCase(str) {
module.exports.camelCase = camelCase;

    return str.replace(/[-_\s](.)/g, (_, char) => char.toUpperCase())
              .replace(/^(.)/, (_, char) => char.toLowerCase());
}

function snakeCase(str) {
module.exports.snakeCase = snakeCase;

    return str.replace(/([A-Z])/g, '_$1')
              .replace(/[-\s]/g, '_')
              .toLowerCase()
              .replace(/^_/, '');
}

function titleCase(str) {
module.exports.titleCase = titleCase;

    return str.replace(/\w\S*/g, txt => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

