const ProductTable = ({ products = [], selectedProductId, onSelectProduct, loading }) => {
  if (loading) {
    return (
      <div className="panel-white">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="panel-white">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <p className="text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <div className="panel-white">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <div className="inventory-table-wrap">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Size</th>
              <th>Colour</th>
              <th>Low Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isSelected = selectedProductId === product._id;
              return (
                <tr
                  key={product._id}
                  onClick={() => onSelectProduct(product._id)}
                  className={isSelected ? 'selected-row cursor-pointer' : 'cursor-pointer'}
                >
                  <td>{product.sku}</td>
                  <td>{product.productName}</td>
                  <td>{Number(product.unitPrice).toFixed(2)}</td>
                  <td>{product.stockQty}</td>
                  <td>{product.size}</td>
                  <td>{product.colour}</td>
                  <td>{product.lowStockThreshold}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;