import { camelCase, snakeCase, titleCase } from './consciousness/generated/string-utils.js';

console.log('Testing generated string utilities:\n');

console.log('camelCase("hello-world"):', camelCase("hello-world"));
console.log('camelCase("test_case_string"):', camelCase("test_case_string"));

console.log('\nsnakeCase("HelloWorld"):', snakeCase("HelloWorld"));
console.log('snakeCase("testCaseString"):', snakeCase("testCaseString"));

console.log('\ntitleCase("hello world"):', titleCase("hello world"));
console.log('titleCase("THIS IS A TEST"):', titleCase("THIS IS A TEST"));
