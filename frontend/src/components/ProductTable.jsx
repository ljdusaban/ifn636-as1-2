/*import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth();

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      alert('Failed to delete task.');
    }
  };

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{task.title}</h2>
          <p>{task.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingTask(task)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
*/
const ProductTable = ({ products, selectedProductId, onSelectProduct, loading }) => {
  return (
    <div className="panel-white">
      <h2 className="text-xl font-semibold mb-4">Products</h2>

      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
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
                    className={isSelected ? 'bg-blue-100 cursor-pointer' : 'cursor-pointer hover:bg-gray-50'}
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
      )}
    </div>
  );
};

export default ProductTable;