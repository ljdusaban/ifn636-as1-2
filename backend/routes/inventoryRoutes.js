
const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct} = require('../controllers/inventoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/products', protect, createProduct);
router.get('/products', protect, getProducts);
router.get('/products/:id', protect, getProductById);
router.put('/products/:id', protect, updateProduct);
router.delete('/products/:id', protect, adminOnly, deleteProduct);

module.exports = router;