import { useEffect, useState } from 'react';

const emptyForm = {
  sku: '',
  productName: '',
  unitPrice: '',
  stockQty: '',
  size: 'M',
  colour: '',
  image: '',
  lowStockThreshold: '',
};

const ProductForm = ({ mode, initialData, disableQuantity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (mode === 'update' && initialData) {
      setFormData({
        sku: initialData.sku || '',
        productName: initialData.productName || '',
        unitPrice:
          initialData.unitPrice !== undefined ? String(initialData.unitPrice) : '',
        stockQty:
          initialData.stockQty !== undefined ? String(initialData.stockQty) : '',
        size: initialData.size || 'M',
        colour: initialData.colour || '',
        image: initialData.image || '',
        lowStockThreshold:
          initialData.lowStockThreshold !== undefined
            ? String(initialData.lowStockThreshold)
            : '',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      sku: formData.sku.trim(),
      productName: formData.productName.trim(),
      unitPrice: Number(formData.unitPrice),
      size: formData.size,
      colour: formData.colour.trim(),
      image: formData.image.trim(),
      lowStockThreshold: Number(formData.lowStockThreshold),
    };

    if (!disableQuantity) {
      payload.stockQty = Number(formData.stockQty);
    }

    onSubmit(payload);
  };

  return (
    <div className="panel-white mb-4">
      <h2 className="text-xl font-semibold mb-4">
        {mode === 'update' ? 'Update Product' : 'Add Product'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="form-field">
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. TSH-001"
            className="field"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="productName">Product Name</label>
          <input
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="e.g. T-Shirt"
            className="field"
            required
          />
        </div>

        <div className="form-field compact-group">
          <label>Pricing and Style</label>
          <div className="form-inline-row form-inline-row-three">
            <div className="form-field compact-field">
              <label htmlFor="unitPrice">Unit Price ($)</label>
              <input
                id="unitPrice"
                name="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="35.50"
                className="field"
                required
              />
            </div>

            <div className="form-field compact-field">
              <label htmlFor="size">Size</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="field"
                required
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div className="form-field compact-field">
              <label htmlFor="colour">Colour</label>
              <input
                id="colour"
                name="colour"
                value={formData.colour}
                onChange={handleChange}
                placeholder="Blue"
                className="field"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-field compact-group">
          <label>Stock Controls</label>
          <div className="form-inline-row form-inline-row-two">
            <div className="form-field compact-field">
              <label htmlFor="stockQty">Quantity</label>
              <input
                id="stockQty"
                name="stockQty"
                type="number"
                min="0"
                value={formData.stockQty}
                onChange={handleChange}
                className="field"
                disabled={disableQuantity}
                required
              />
            </div>

            <div className="form-field compact-field">
              <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
              <input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="field"
                required
              />
            </div>
          </div>
          {disableQuantity && (
            <p className="field-hint">Staff users can update other details but cannot change quantity.</p>
          )}
        </div>

        <div className="form-field md:col-span-2">
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/product.jpg"
            className="field"
          />
          <p className="field-hint">Must be a direct image URL ending in .jpg, .png, .webp, etc. (not a webpage link).</p>
        </div>

        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            {mode === 'update' ? 'Save Changes' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
