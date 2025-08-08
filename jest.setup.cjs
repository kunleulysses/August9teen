// Jest setup file - conditional based on environment
// Only set up DOM mocks if in jsdom environment
if (typeof window !== 'undefined') {
  // Browser/React testing setup
  import('@testing-library/jest-dom');
  
  // Mock window object for React components
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
}

// Common setup for all environments
// Global test utilities for TypeScript
global.describe = describe;
global.it = it;
global.test = test;
global.expect = expect;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.afterAll = afterAll;

// Ensure required secrets exist for tests
process.env.SPIRAL_EVENT_SECRET = process.env.SPIRAL_EVENT_SECRET || 'test-secret';

// Mock console methods in tests to reduce noise (optional)
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  // Uncomment these if you want to suppress console output in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};