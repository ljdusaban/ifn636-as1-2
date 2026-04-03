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

const ProductForm = ({ mode, initialData, onSubmit, onCancel }) => {
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
      stockQty: Number(formData.stockQty),
      size: formData.size,
      colour: formData.colour.trim(),
      image: formData.image.trim(),
      lowStockThreshold: Number(formData.lowStockThreshold),
    };

    onSubmit(payload);
  };

  return (
    <div className="panel-white mb-4">
      <h2 className="text-xl font-semibold mb-4">
        {mode === 'update' ? 'Update Product' : 'Add Product'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          placeholder="SKU"
          className="field"
          required
        />
        <input
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="Product Name"
          className="field"
          required
        />
        <input
          name="unitPrice"
          type="number"
          step="0.01"
          min="0"
          value={formData.unitPrice}
          onChange={handleChange}
          placeholder="Unit Price"
          className="field"
          required
        />
        <input
          name="stockQty"
          type="number"
          min="0"
          value={formData.stockQty}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="field"
          required
        />
        <select
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
        <input
          name="colour"
          value={formData.colour}
          onChange={handleChange}
          placeholder="Colour"
          className="field"
          required
        />
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="field"
        />
        <input
          name="lowStockThreshold"
          type="number"
          min="0"
          value={formData.lowStockThreshold}
          onChange={handleChange}
          placeholder="Low Stock Threshold"
          className="field"
          required
        />

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
