import { storeFactory } from '../../common/storeFactory.js';
import logger from '../../common/logger.js';
import { DNASigilRealityEncoding } from '../../consciousness/dna-sigil-reality-encoding.js';

const encoder = new DNASigilRealityEncoding({
  logger,
  store: storeFactory(),
});

export default {
  async encodeReality(reality) {
    return await encoder.encodeRealityWithDNASigil(reality);
  },
  async getEncodedReality(id) {
    return await encoder.getEncodedReality(id);
  }
};