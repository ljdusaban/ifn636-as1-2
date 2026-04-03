
const express = require('express');
const { createProduct, getProducts, getProductById } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/products', protect, createProduct);
router.get('/products', protect, getProducts);
router.get('/products/:id', protect, getProductById);

module.exports = router;