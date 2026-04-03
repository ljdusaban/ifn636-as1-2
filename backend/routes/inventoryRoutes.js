
const express = require('express');
const { createProduct } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/products', protect, createProduct);

module.exports = router;