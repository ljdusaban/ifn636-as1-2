import { useCallback, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../axiosConfig';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formMode, setFormMode] = useState('create'); // create | update
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [priceOperator, setPriceOperator] = useState('gte');
  const [activeFilters, setActiveFilters] = useState({
    keyword: '',
    size: '',
    unitPrice: '',
    priceFilter: 'gte',
  });

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const authHeaders = useMemo(
    () => ({ headers: { Authorization: 'Bearer ' + (user?.token || '') } }),
    [user?.token]
  );

  const fetchProducts = useCallback(async (filters = activeFilters) => {
    if (!user?.token) return;

    const params = {};
    if (filters.keyword) {
      params.keyword = filters.keyword;
    }
    if (filters.size) {
      params.size = filters.size;
    }
    if (filters.unitPrice !== '') {
      params.unitPrice = filters.unitPrice;
      params.priceFilter = filters.priceFilter;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/inventory/products', {
        ...authHeaders,
        params,
      });
      setProducts(response.data);
      setSelectedProductId((previousId) => (
        response.data.some((item) => item._id === previousId) ? previousId : null
      ));
    } catch (error) {
      alert('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, [user?.token, authHeaders, activeFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openCreateForm = () => {
    setFormMode('create');
    setIsFormOpen(true);
  };

  const openUpdateForm = () => {
    if (!selectedProduct) return;
    setFormMode('update');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const applyFilters = () => {
    const nextFilters = {
      keyword: searchKeyword.trim(),
      size: sizeFilter,
      unitPrice: priceValue,
      priceFilter: priceOperator,
    };

    setActiveFilters(nextFilters);
    fetchProducts(nextFilters);
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSizeFilter('');
    setPriceValue('');
    setPriceOperator('gte');
    const resetFilters = { keyword: '', size: '', unitPrice: '', priceFilter: 'gte' };
    setActiveFilters(resetFilters);
    fetchProducts(resetFilters);
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('Only admin users can delete products.');
      return;
    }

    if (!selectedProduct) return;

    const ok = window.confirm(
      `Are you sure you want to delete product "${selectedProduct.productName}" (SKU: ${selectedProduct.sku})?`
    );
    if (!ok) return;

    try {
      await axiosInstance.delete(
        `/api/inventory/products/${selectedProduct._id}`,
        authHeaders
      );
      setSelectedProductId(null);
      await fetchProducts();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (formMode === 'create') {
        await axiosInstance.post('/api/inventory/products', payload, authHeaders);
      } else if (selectedProduct) {
        await axiosInstance.put(
          '/api/inventory/products/' + selectedProduct._id,
          payload,
          authHeaders
        );
      }

      setIsFormOpen(false);
      setSelectedProductId(null);
      await fetchProducts();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to save product.');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="panel-white mb-4">
          <div className="toolbar-row">
            <div className="action-group">
              <button
                type="button"
                onClick={openCreateForm}
                className="action-btn action-add"
              >
              Add
              </button>

              <button
                type="button"
                onClick={openUpdateForm}
                disabled={!selectedProduct}
                className="action-btn action-update"
              >
              Update
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={!selectedProduct || !isAdmin}
                className="action-btn action-delete"
              >
              Delete
              </button>
            </div>

            <div className="filter-group">
              <input
                type="text"
                placeholder="Search by SKU or Name"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="toolbar-input"
              />

              <select
                value={priceOperator}
                onChange={(e) => setPriceOperator(e.target.value)}
                className="toolbar-select"
              >
                <option value="gte">Price &gt;=</option>
                <option value="lte">Price &lt;=</option>
              </select>

              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Price"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                className="toolbar-number"
              />

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="toolbar-select"
              >
                <option value="">All Sizes</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>

              <button
                type="button"
                onClick={applyFilters}
                className="action-btn action-search"
              >
                Search
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="action-btn action-clear"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {isFormOpen && (
          <ProductForm
            mode={formMode}
            initialData={formMode === 'update' ? selectedProduct : null}
            disableQuantity={formMode === 'update' && !isAdmin}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
          />
        )}

        <ProductTable
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Products;