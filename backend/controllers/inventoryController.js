//Inventory controller

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
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({ message: 'SKU already exists' });
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