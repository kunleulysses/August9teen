module.exports = {
  ExternalCopy: class {
    constructor(value) { this.value = value; }
    copy() { return this.value; }
  },
  // Minimal API surface used in tests; extend as needed
};

