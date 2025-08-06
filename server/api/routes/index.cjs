const express = require('express');
const realities = require('./realities.cjs');
const memory = require('./memory.cjs');
const router = express.Router();
router.use('/realities', realities);
router.use('/memory', memory);
module.exports = router;