//Inventory controller
const Product = require('../models/Product');

//Create Product
const createProduct = async (req, res) => {
  const {
    sku,
    productName,
    unitPrice,
    stockQty,
    size,
    colour,
    image,
    lowStockThreshold,
  } = req.body;

  try {
    if (
      !sku || !productName || unitPrice === undefined || stockQty === undefined ||
      !size || !colour || lowStockThreshold === undefined
    ) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({ message: 'SKU already exists.' });
    }

    const totalValue = Number(unitPrice) * Number(stockQty);

    const product = await Product.create({
      sku,
      productName,
      unitPrice,
      stockQty,
      totalValue,
      size,
      colour,
      image,
      lowStockThreshold,
      createdBy: req.user.id,
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//View Products
const getProducts = async (req, res) => {
try {
const products = await Product.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
return res.status(200).json(products);
} catch (error) {
return res.status(500).json({ message: error.message });
}
};

const getProductById = async (req, res) => {
try {
const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  return res.status(200).json(product);
} catch (error) {
  return res.status(500).json({ message: error.message });
}
};


//Update Product
const updateProduct = async (req, res) => {
  const {
    sku,
    productName,
    unitPrice,
    stockQty,
    size,
    colour,
    image,
    lowStockThreshold,
  } = req.body;

  try {
    const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    //Check SKU is still unique after change
    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({ sku });
      if (skuExists) {
        return res.status(400).json({ message: 'SKU already exists.' });
      }
      product.sku = sku;
    }

    product.productName = productName || product.productName;
    product.size = size || product.size;
    product.colour = colour || product.colour;
    product.image = image !== undefined ? image : product.image;

    if (unitPrice !== undefined) product.unitPrice = Number(unitPrice);
    if (stockQty !== undefined) product.stockQty = Number(stockQty);
    if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);

    //Recalculate total value when price/qty change
    product.totalValue = Number(product.unitPrice) * Number(product.stockQty);

    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }
    return res.status(500).json({ message: error.message });
  }
};

//Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };