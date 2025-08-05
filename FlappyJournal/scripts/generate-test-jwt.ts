#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const { program } = require('commander');
const crypto = require('crypto');

// Default configuration
const DEFAULT_SECRET = process.env.JWT_SECRET || 'test-secret';
const DEFAULT_EXPIRES_IN = '1h';
const DEFAULT_ALGORITHM = 'HS256';

// Parse command line arguments
program
  .name('generate-test-jwt')
  .description('Generate a JWT for testing authentication')
  .option('-s, --secret <secret>', 'JWT secret', DEFAULT_SECRET)
  .option('-e, --expires-in <time>', 'Token expiration time', DEFAULT_EXPIRES_IN)
  .option('-a, --algorithm <algorithm>', 'JWT algorithm', DEFAULT_ALGORITHM)
  .option('-u, --user-id <id>', 'User ID', 'test-user')
  .option('-r, --roles <roles>', 'Comma-separated list of roles', 'user')
  .option('-t, --tenant <tenant>', 'Tenant ID', 'test-tenant')
  .option('-o, --output <format>', 'Output format: token, json, or env', 'token')
  .option('--no-verify', 'Generate token without verification')
  .option('--no-exp', 'Generate token without expiration')
  .option('--no-iat', 'Generate token without issued at time')
  .option('--no-nbf', 'Generate token without not before time')
  .option('--no-jti', 'Generate token without JWT ID')
  .option('--no-sub', 'Generate token without subject')
  .option('--no-aud', 'Generate token without audience')
  .option('--no-iss', 'Generate token without issuer')
  .option('--no-roles', 'Generate token without roles')
  .option('--no-tenant', 'Generate token without tenant')
  .option('--no-user-id', 'Generate token without user ID')
  .option('--no-sign', 'Generate unsigned token')
  .option('--no-verify', 'Generate token without verification')
  .option('--no-validate', 'Skip token validation')
  .option('--no-pretty', 'Disable pretty printing')
  .option('--no-color', 'Disable colored output')
  .option('--no-emoji', 'Disable emoji')
  .option('--no-progress', 'Disable progress bar')
  .option('--no-spinner', 'Disable spinner')
  .option('--quiet', 'Disable all output except errors')
  .option('--silent', 'Disable all output')
  .option('--debug', 'Enable debug output')
  .option('--verbose', 'Enable verbose output')
  .option('--version', 'Show version')
  .option('--help', 'Show help')
  .parse(process.argv);

const options = program.opts();

// Generate a random secret if none provided
const secret = options.secret || crypto.randomBytes(32).toString('hex');

// Prepare token payload
const payload = {};

// Standard claims
if (options.sub) payload.sub = options.userId;
if (options.iss) payload.iss = 'spiral-memory-test';
if (options.aud) payload.aud = 'spiral-memory';
if (options.exp && !options.noExp) payload.exp = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour
if (options.iat && !options.noIat) payload.iat = Math.floor(Date.now() / 1000);
if (options.nbf && !options.noNbf) payload.nbf = Math.floor(Date.now() / 1000);
if (options.jti && !options.noJti) payload.jti = crypto.randomUUID();

// Custom claims
if (options.roles && !options.noRoles) payload.roles = options.roles.split(',').map(r => r.trim());
if (options.tenant && !options.noTenant) payload.tenant = options.tenant;
if (options.userId && !options.noUserId) payload.userId = options.userId;

// Generate token
const token = jwt.sign(payload, secret, {
  algorithm: options.algorithm,
  expiresIn: options.expiresIn,
  noTimestamp: options.noIat,
  jwtid: options.jti ? crypto.randomUUID() : undefined,
  subject: options.sub ? options.userId : undefined,
  audience: options.aud ? 'spiral-memory' : undefined,
  issuer: options.iss ? 'spiral-memory-test' : undefined,
  notBefore: options.nbf ? 0 : undefined,
  header: {
    typ: 'JWT',  
    alg: options.algorithm,
    kid: 'test-key-1'
  }
});

// Output based on format
switch (options.output.toLowerCase()) {
  case 'json':
    console.log(JSON.stringify({
      token,
      payload,
      secret,
      algorithm: options.algorithm,
      expiresIn: options.expiresIn
    }, null, 2));
    break;
    
  case 'env':
    console.log(`export TEST_JWT="${token}"`);
    console.log(`export JWT_SECRET="${secret}"`);
    console.log(`export JWT_ALGORITHM="${options.algorithm}"`);
    break;
    
  default: // token
    console.log(token);
}

// If not in silent mode, show additional info
if (!options.silent && !options.quiet) {
  console.error('\nToken Information:');
  console.error(`- Algorithm: ${options.algorithm}`);
  console.error(`- Expires In: ${options.expiresIn}`);
  console.error(`- User ID: ${options.userId}`);
  console.error(`- Roles: ${options.roles}`);
  console.error(`- Tenant: ${options.tenant}`);
  console.error(`- Secret: ${options.secret ? '***** (from --secret)' : secret}`);
  
  if (options.debug) {
    console.error('\nDebug Information:');
    console.error('- Payload:', JSON.stringify(payload, null, 2));
    console.error('- Token:', token);
  }
}

// Exit with success code
process.exit(0);
