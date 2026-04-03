/*import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/ProductForm';
import TaskList from '../components/ProductTable';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/api/tasks', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
      } catch (error) {
        alert('Failed to fetch tasks.');
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <TaskForm
        tasks={tasks}
        setTasks={setTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />
      <TaskList tasks={tasks} setTasks={setTasks} setEditingTask={setEditingTask} />
    </div>
  );
};

export default Tasks;
*/

import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../axiosConfig';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formMode, setFormMode] = useState('create'); // create | update
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const authHeaders = {
    headers: { Authorization: 'Bearer ' + (user?.token || '') },
  };

  const fetchProducts = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/inventory/products', authHeaders);
      setProducts(response.data);
    } catch (error) {
      alert('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.token]);

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

  const handleDelete = async () => {
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
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openCreateForm}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Add
            </button>

            <button
              type="button"
              onClick={openUpdateForm}
              disabled={!selectedProduct}
              className={`px-4 py-2 rounded text-white ${selectedProduct
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-amber-300 cursor-not-allowed'
                }`}
            >
              Update
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={!selectedProduct}
              className={`px-4 py-2 rounded text-white ${selectedProduct
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-red-300 cursor-not-allowed'
                }`}
            >
              Delete
            </button>
          </div>
        </div>

        {isFormOpen && (
          <ProductForm
            mode={formMode}
            initialData={formMode === 'update' ? selectedProduct : null}
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