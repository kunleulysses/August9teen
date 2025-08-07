/**
 * StorageDriver Interface for Sigil-DNA
 * Provides unified abstraction for all persistence backends
 */

export interface StorageDriver {
  /**
   * Store a sigil record with tenant isolation
   * @param tenantId - Tenant identifier for multi-tenant isolation
   * @param sigilId - Unique sigil identifier
   * @param authHash - Authentication hash for the sigil
   * @param record - Complete sigil record object
   * @returns Promise that resolves when record is stored
   */
  setSigilRecord(tenantId: string, sigilId: string, authHash: string, record: object): Promise<void>;

  /**
   * Retrieve a specific sigil record
   * @param tenantId - Tenant identifier
   * @param sigilId - Unique sigil identifier
   * @param authHash - Authentication hash for verification
   * @returns Promise that resolves to the record or undefined if not found
   */
  getSigilRecord(tenantId: string, sigilId: string, authHash: string): Promise<object | undefined>;

  /**
   * Retrieve all sigil records for a tenant
   * @param tenantId - Tenant identifier
   * @param options - Optional pagination and filtering options
   * @returns Promise that resolves to array of records
   */
  allSigilRecords(tenantId: string, options?: {
    limit?: number;
    cursor?: string;
    filter?: object;
  }): Promise<object[]>;

  /**
   * Delete a specific sigil record
   * @param tenantId - Tenant identifier
   * @param sigilId - Unique sigil identifier
   * @param authHash - Authentication hash for verification
   * @returns Promise that resolves when record is deleted
   */
  deleteSigilRecord(tenantId: string, sigilId: string, authHash: string): Promise<void>;

  /**
   * Check if a sigil record exists
   * @param tenantId - Tenant identifier
   * @param sigilId - Unique sigil identifier
   * @param authHash - Authentication hash for verification
   * @returns Promise that resolves to boolean indicating existence
   */
  existsSigilRecord(tenantId: string, sigilId: string, authHash: string): Promise<boolean>;

  /**
   * Get count of sigil records for a tenant
   * @param tenantId - Tenant identifier
   * @returns Promise that resolves to count of records
   */
  countSigilRecords(tenantId: string): Promise<number>;

  /**
   * Perform atomic batch operations
   * @param operations - Array of operations to perform atomically
   * @returns Promise that resolves when all operations complete
   */
  batch(operations: Array<{
    type: 'put' | 'del';
    tenantId: string;
    sigilId: string;
    authHash: string;
    record?: object;
  }>): Promise<void>;

  /**
   * Close the storage connection and cleanup resources
   * @returns Promise that resolves when cleanup is complete
   */
  close(): Promise<void>;

  /**
   * Get storage health and statistics
   * @returns Promise that resolves to health information
   */
  getHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: object;
  }>;
}

/**
 * Storage Driver Factory
 * Creates appropriate storage driver based on configuration
 */
export interface StorageDriverFactory {
  /**
   * Create a storage driver instance
   * @param config - Configuration object for the driver
   * @returns Promise that resolves to configured driver instance
   */
  create(config: StorageDriverConfig): Promise<StorageDriver>;
}

/**
 * Configuration for storage drivers
 */
export interface StorageDriverConfig {
  type: 'leveldb' | 'postgres' | 'memory';
  path?: string;
  connectionString?: string;
  options?: {
    [key: string]: any;
  };
}

/**
 * Error types for storage operations
 */
export class StorageError extends Error {
  constructor(message: string, public code: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

export class TenantIsolationError extends StorageError {
  constructor(message: string, cause?: Error) {
    super(message, 'TENANT_ISOLATION_ERROR', cause);
  }
}

export class RecordNotFoundError extends StorageError {
  constructor(message: string, cause?: Error) {
    super(message, 'RECORD_NOT_FOUND', cause);
  }
}

export class StorageUnavailableError extends StorageError {
  constructor(message: string, cause?: Error) {
    super(message, 'STORAGE_UNAVAILABLE', cause);
  }
}