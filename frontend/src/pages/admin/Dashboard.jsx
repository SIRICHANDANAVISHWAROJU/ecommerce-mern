import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader } from '../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [users, products, orders] = await Promise.all([
          api.get('/users'),
          api.get('/products'),
          api.get('/orders'),
        ]);
        const revenue = orders.data.reduce(
          (acc, o) => acc + (o.isPaid ? o.totalPrice : 0),
          0
        );
        setStats({
          users: users.data.length,
          products: products.data.total ?? products.data.products.length,
          orders: orders.data.length,
          revenue,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Users', value: stats.users, link: '/admin/users' },
    { label: 'Total Products', value: stats.products, link: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, link: '/admin/orders' },
    { label: 'Revenue (paid)', value: `$${stats.revenue.toFixed(2)}`, link: '/admin/orders' },
  ];

  return (
    <>
      <h1>Admin Dashboard</h1>
      <p className="muted mb-2">Manage your store from here.</p>
      <div className="product-grid">
        {cards.map((c) => (
          <Link to={c.link} key={c.label} className="card" style={{ padding: '1.5rem' }}>
            <div className="muted" style={{ fontSize: '0.875rem' }}>{c.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
              {c.value}
            </div>
          </Link>
        ))}
      </div>
      <div className="flex gap-1 mt-2" style={{ flexWrap: 'wrap' }}>
        <Link to="/admin/products" className="btn btn-primary">Manage Products</Link>
        <Link to="/admin/orders" className="btn btn-outline">View Orders</Link>
        <Link to="/admin/users" className="btn btn-outline">Manage Users</Link>
      </div>
    </>
  );
};

export default AdminDashboard;
