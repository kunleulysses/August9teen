import { storeFactory } from '../../common/storeFactory.cjs';
import logger from '../../common/logger.cjs';
import { DNASigilRealityEncoding } from '../../consciousness/dna-sigil-reality-encoding.cjs';

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