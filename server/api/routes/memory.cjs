const express = require('express');
const router = express.Router();
const { generateId } = require('../../common/id.cjs');
const eventBusPkg = require('../../consciousness/ConsciousnessEventBus.cjs');
const eventBus = eventBusPkg.default || eventBusPkg;

router.post('/', (req, res) => {
  const opId = generateId();
  eventBus.emit('memory.store', { opId, ...req.body });
  res.status(202).json({ opId });
});

module.exports = router;
