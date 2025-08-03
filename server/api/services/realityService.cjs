const { storeFactory } = require('../../common/storeFactory.cjs');
const logger = require('../../common/logger.cjs');
const { DNASigilRealityEncoding } = require('../../consciousness/dna-sigil-reality-encoding.cjs');

const encoder = new DNASigilRealityEncoding({
  logger,
  store: storeFactory(),
});

module.exports = {
  async encodeReality(reality) {
    return await encoder.encodeRealityWithDNASigil(reality);
  },
  async getEncodedReality(id) {
    return await encoder.getEncodedReality(id);
  }
};