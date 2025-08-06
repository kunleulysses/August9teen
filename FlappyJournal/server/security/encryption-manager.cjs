const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class EncryptionManager {
    constructor(options = {}) {
        this.algorithm = options.algorithm || 'aes-256-gcm';
        this.keyDerivationIterations = options.keyDerivationIterations || 100000;
        this.saltLength = options.saltLength || 32;
        this.ivLength = options.ivLength || 16;
        this.tagLength = options.tagLength || 16;
        
        // Initialize encryption keys
        this.masterKey = options.masterKey || process.env.SPIRAL_MEMORY_MASTER_KEY;
        this.dataEncryptionKey = null;
        this.keyEncryptionKey = null;
        
        if (!this.masterKey) {
            console.warn('⚠️  Master encryption key not provided. Encryption features disabled.');
            console.warn('⚠️  Set SPIRAL_MEMORY_MASTER_KEY environment variable to enable encryption.');
            this.encryptionEnabled = false;
        } else {
            this.encryptionEnabled = true;
            this.initializeKeys();
        }
    }

    initializeKeys() {
        if (!this.masterKey) {
            return;
        }
        
        // Derive data encryption key and key encryption key from master key
        const salt1 = crypto.createHash('sha256').update(this.masterKey + 'data').digest();
        const salt2 = crypto.createHash('sha256').update(this.masterKey + 'key').digest();
        
        this.dataEncryptionKey = crypto.pbkdf2Sync(
            this.masterKey, 
            salt1, 
            this.keyDerivationIterations, 
            32, 
            'sha256'
        );
        
        this.keyEncryptionKey = crypto.pbkdf2Sync(
            this.masterKey, 
            salt2, 
            this.keyDerivationIterations, 
            32, 
            'sha256'
        );
    }

    generateDataKey() {
        // Generate a new random data encryption key for each memory item
        return crypto.randomBytes(32);
    }

    encryptDataKey(dataKey) {
        // Encrypt the data key using the key encryption key
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipher(this.algorithm, this.keyEncryptionKey);
        cipher.setAAD(Buffer.from('spiral-memory-key'));
        
        let encrypted = cipher.update(dataKey);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        const authTag = cipher.getAuthTag();
        
        return {
            encryptedKey: encrypted.toString('base64'),
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
            algorithm: this.algorithm
        };
    }

    decryptDataKey(encryptedKeyData) {
        const decipher = crypto.createDecipher(
            encryptedKeyData.algorithm || this.algorithm, 
            this.keyEncryptionKey
        );
        
        decipher.setAAD(Buffer.from('spiral-memory-key'));
        decipher.setAuthTag(Buffer.from(encryptedKeyData.authTag, 'base64'));
        
        let decrypted = decipher.update(Buffer.from(encryptedKeyData.encryptedKey, 'base64'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        return decrypted;
    }

    encryptMemoryData(data, dataKey = null) {
        if (!dataKey) {
            dataKey = this.generateDataKey();
        }
        
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipher(this.algorithm, dataKey);
        
        // Add additional authenticated data
        const aad = Buffer.from('spiral-memory-data');
        cipher.setAAD(aad);
        
        // Convert data to string if it's an object
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        
        let encrypted = cipher.update(dataString, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        const authTag = cipher.getAuthTag();
        
        return {
            encryptedData: encrypted.toString('base64'),
            iv: iv.toString('base64'),
            authTag: authTag.toString('base64'),
            algorithm: this.algorithm,
            dataKey: dataKey
        };
    }

    decryptMemoryData(encryptedData, dataKey) {
        const decipher = crypto.createDecipher(
            encryptedData.algorithm || this.algorithm, 
            dataKey
        );
        
        decipher.setAAD(Buffer.from('spiral-memory-data'));
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));
        
        let decrypted = decipher.update(Buffer.from(encryptedData.encryptedData, 'base64'), null, 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }

    encryptMemory(memoryData) {
        // Generate a unique data key for this memory
        const dataKey = this.generateDataKey();
        
        // Encrypt the memory data
        const encryptedData = this.encryptMemoryData(memoryData, dataKey);
        
        // Encrypt the data key
        const encryptedKey = this.encryptDataKey(dataKey);
        
        return {
            encryptedMemory: {
                data: encryptedData,
                key: encryptedKey,
                timestamp: new Date().toISOString(),
                version: '1.0'
            }
        };
    }

    decryptMemory(encryptedMemory) {
        // Decrypt the data key
        const dataKey = this.decryptDataKey(encryptedMemory.key);
        
        // Decrypt the memory data
        const decryptedData = this.decryptMemoryData(encryptedMemory.data, dataKey);
        
        // Try to parse as JSON, fallback to string
        try {
            return JSON.parse(decryptedData);
        } catch {
            return decryptedData;
        }
    }

    // Utility methods for spiral topology encryption
    encryptSpiralTopology(topology) {
        const dataKey = this.generateDataKey();
        const encryptedData = this.encryptMemoryData(topology, dataKey);
        const encryptedKey = this.encryptDataKey(dataKey);
        
        return {
            encryptedTopology: {
                data: encryptedData,
                key: encryptedKey,
                timestamp: new Date().toISOString(),
                type: 'spiral-topology'
            }
        };
    }

    decryptSpiralTopology(encryptedTopology) {
        const dataKey = this.decryptDataKey(encryptedTopology.key);
        const decryptedData = this.decryptMemoryData(encryptedTopology.data, dataKey);
        
        try {
            return JSON.parse(decryptedData);
        } catch {
            return decryptedData;
        }
    }

    // File-based encryption for LevelDB
    async encryptFile(filePath, data) {
        const dataKey = this.generateDataKey();
        const encryptedData = this.encryptMemoryData(data, dataKey);
        const encryptedKey = this.encryptDataKey(dataKey);
        
        const encryptedFile = {
            data: encryptedData,
            key: encryptedKey,
            timestamp: new Date().toISOString(),
            originalPath: filePath
        };
        
        await fs.writeFile(filePath + '.enc', JSON.stringify(encryptedFile), 'utf8');
        return filePath + '.enc';
    }

    async decryptFile(encryptedFilePath) {
        const encryptedFile = JSON.parse(await fs.readFile(encryptedFilePath, 'utf8'));
        
        const dataKey = this.decryptDataKey(encryptedFile.key);
        const decryptedData = this.decryptMemoryData(encryptedFile.data, dataKey);
        
        return decryptedData;
    }

    // Key rotation support
    rotateKeys() {
        // Generate new master key (should be done externally)
        // This method prepares for key rotation
        const newMasterKey = crypto.randomBytes(32).toString('hex');
        
        return {
            newMasterKey,
            rotationTimestamp: new Date().toISOString(),
            previousKeyHash: crypto.createHash('sha256').update(this.masterKey).digest('hex')
        };
    }

    // Integrity verification
    generateIntegrityHash(data) {
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    verifyIntegrity(data, expectedHash) {
        const actualHash = this.generateIntegrityHash(data);
        return actualHash === expectedHash;
    }

    // Secure key derivation for different purposes
    deriveKey(purpose, salt = null) {
        if (!salt) {
            salt = crypto.createHash('sha256').update(this.masterKey + purpose).digest();
        }
        
        return crypto.pbkdf2Sync(
            this.masterKey, 
            salt, 
            this.keyDerivationIterations, 
            32, 
            'sha256'
        );
    }

    // Memory-safe key clearing
    clearSensitiveData() {
        if (this.dataEncryptionKey) {
            this.dataEncryptionKey.fill(0);
        }
        if (this.keyEncryptionKey) {
            this.keyEncryptionKey.fill(0);
        }
    }

    // Encryption status check
    isEncryptionEnabled() {
        return this.encryptionEnabled && !!(this.masterKey && this.dataEncryptionKey && this.keyEncryptionKey);
    }

    // Get encryption metadata
    getEncryptionMetadata() {
        return {
            algorithm: this.algorithm,
            keyDerivationIterations: this.keyDerivationIterations,
            saltLength: this.saltLength,
            ivLength: this.ivLength,
            tagLength: this.tagLength,
            encryptionEnabled: this.isEncryptionEnabled(),
            version: '1.0'
        };
    }
}

module.exports = { EncryptionManager };
