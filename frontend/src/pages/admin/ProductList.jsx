import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Loader, Message } from '../../components/Loader';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products?page=1');
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!confirm('Create a new sample product?')) return;
    try {
      const { data } = await api.post('/products');
      toast.success('Product created — now edit it');
      navigate(`/admin/products/${data._id}/edit`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <>
      <div className="flex-between mb-2">
        <h1 style={{ marginBottom: 0 }}>Products</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Create Product
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p._id.slice(-6)}</td>
                  <td>{p.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td>{p.countInStock}</td>
                  <td>
                    <Link to={`/admin/products/${p._id}/edit`} className="btn btn-outline btn-sm">
                      Edit
                    </Link>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminProductList;
