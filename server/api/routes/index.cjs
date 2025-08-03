const express = require('express');
const realities = require('./realities.cjs');
const router = express.Router();
router.use('/realities', realities);
module.exports = router;