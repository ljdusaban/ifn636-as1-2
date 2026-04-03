
const mongoose = require('mongoose');

const sizeTypes = ['XS', 'S', 'M', 'L', 'XL'];

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    productName: { type: String, required: true, trim: true },
    unitPrice: { type: Number, required: true, min: 0 }, // Real -> Number
    stockQty: { type: Number, required: true, min: 0 },  // Integer -> Number
    totalValue: { type: Number, required: true, min: 0 }, // unitPrice * stockQty
    size: { type: String, enum: sizeTypes, required: true },
    colour: { type: String, required: true, trim: true },
    image: { type: String, default: '' }, // store image URL/path first
    lowStockThreshold: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);