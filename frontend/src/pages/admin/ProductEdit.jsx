import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Loader } from '../../components/Loader';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setForm({
          name: data.name,
          price: data.price,
          image: data.image,
          brand: data.brand,
          category: data.category,
          countInStock: data.countInStock,
          description: data.description,
        });
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (key) => (e) => {
    const value = ['price', 'countInStock'].includes(key)
      ? Number(e.target.value)
      : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/products/${id}`, form);
      toast.success('Product saved');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Link to="/admin/products" className="btn btn-outline btn-sm mb-2">← Back</Link>
      <div className="form-card" style={{ maxWidth: 600 }}>
        <h1>Edit Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input className="form-input" value={form.name} onChange={handleChange('name')} required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={form.price}
              onChange={handleChange('price')}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input className="form-input" value={form.image} onChange={handleChange('image')} />
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input className="form-input" value={form.brand} onChange={handleChange('brand')} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input className="form-input" value={form.category} onChange={handleChange('category')} required />
          </div>
          <div className="form-group">
            <label>Stock count</label>
            <input
              type="number"
              className="form-input"
              value={form.countInStock}
              onChange={handleChange('countInStock')}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input"
              rows={4}
              value={form.description}
              onChange={handleChange('description')}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={saving}>
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminProductEdit;
