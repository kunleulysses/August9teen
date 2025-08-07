const https = require('https');
const fs = require('fs');
const path = require('path');

class TLSConfig {
  constructor() {
    this.validateConfig();
    this.agent = this.createHTTPSAgent();
  }

  validateConfig() {
    const dnaStoreUrl = process.env.DNASTORE_URL;
    
    if (!dnaStoreUrl) {
      throw new Error('DNASTORE_URL environment variable is required');
    }
    
    if (!dnaStoreUrl.startsWith('https://')) {
      throw new Error('DNASTORE_URL must use https:// protocol for security');
    }
    
    // Validate certificate paths if mTLS is configured
    const clientCert = process.env.DNASTORE_CLIENT_CERT;
    const clientKey = process.env.DNASTORE_CLIENT_KEY;
    const caCert = process.env.DNASTORE_CA_CERT;
    
    if (clientCert && !fs.existsSync(clientCert)) {
      throw new Error(`Client certificate not found: ${clientCert}`);
    }
    
    if (clientKey && !fs.existsSync(clientKey)) {
      throw new Error(`Client key not found: ${clientKey}`);
    }
    
    if (caCert && !fs.existsSync(caCert)) {
      throw new Error(`CA certificate not found: ${caCert}`);
    }
    
    console.log('TLS configuration validated successfully');
  }

  createHTTPSAgent() {
    const options = {
      rejectUnauthorized: process.env.DNASTORE_REJECT_UNAUTHORIZED !== 'false'
    };
    
    // Add client certificate for mTLS if configured
    if (process.env.DNASTORE_CLIENT_CERT) {
      try {
        options.cert = fs.readFileSync(process.env.DNASTORE_CLIENT_CERT);
        console.log('Client certificate loaded for mTLS');
      } catch (error) {
        throw new Error(`Failed to read client certificate: ${error.message}`);
      }
    }
    
    if (process.env.DNASTORE_CLIENT_KEY) {
      try {
        options.key = fs.readFileSync(process.env.DNASTORE_CLIENT_KEY);
        console.log('Client key loaded for mTLS');
      } catch (error) {
        throw new Error(`Failed to read client key: ${error.message}`);
      }
    }
    
    // Add custom CA if configured
    if (process.env.DNASTORE_CA_CERT) {
      try {
        options.ca = fs.readFileSync(process.env.DNASTORE_CA_CERT);
        console.log('Custom CA certificate loaded');
      } catch (error) {
        throw new Error(`Failed to read CA certificate: ${error.message}`);
      }
    }
    
    // Warn if certificate validation is disabled
    if (!options.rejectUnauthorized) {
      console.warn('WARNING: TLS certificate validation is disabled. This is insecure for production!');
    }
    
    return new https.Agent(options);
  }

  getAgent() {
    return this.agent;
  }

  // Test TLS connection
  async testConnection() {
    const fetch = require('node-fetch');
    const url = `${process.env.DNASTORE_URL}/health`;
    
    try {
      const response = await fetch(url, { 
        agent: this.agent,
        timeout: 5000
      });
      
      console.log(`TLS connection test successful: ${response.status}`);
      return true;
    } catch (error) {
      console.error('TLS connection test failed:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
let tlsConfig;
try {
  tlsConfig = new TLSConfig();
} catch (error) {
  console.error('Failed to initialize TLS configuration:', error.message);
  process.exit(1);
}

module.exports = { tlsConfig };