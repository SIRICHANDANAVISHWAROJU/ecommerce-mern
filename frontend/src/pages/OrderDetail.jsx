import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Loader, Message } from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handlePay = async () => {
    try {
      await api.put(`/orders/${id}/pay`);
      toast.success('Marked as paid');
      loadOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDeliver = async () => {
    try {
      await api.put(`/orders/${id}/deliver`);
      toast.success('Marked as delivered');
      loadOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!order) return null;

  return (
    <>
      <h1>Order {order._id.slice(-8)}</h1>
      <div className="row-split">
        <div>
          <div className="summary-card mb-1">
            <h2>Shipping</h2>
            <p><strong>Name:</strong> {order.user?.name}</p>
            <p><strong>Email:</strong> {order.user?.email}</p>
            <p>
              <strong>Address:</strong>{' '}
              {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <div className="mt-1">
              {order.isDelivered ? (
                <span className="badge badge-success">
                  Delivered {new Date(order.deliveredAt).toLocaleDateString()}
                </span>
              ) : (
                <span className="badge badge-warning">Not delivered</span>
              )}
            </div>
          </div>
          <div className="summary-card mb-1">
            <h2>Payment</h2>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <div className="mt-1">
              {order.isPaid ? (
                <span className="badge badge-success">
                  Paid {new Date(order.paidAt).toLocaleDateString()}
                </span>
              ) : (
                <span className="badge badge-warning">Not paid</span>
              )}
            </div>
          </div>
          <div className="summary-card">
            <h2>Items</h2>
            {order.orderItems.map((it) => (
              <div key={it.product} className="summary-row">
                <span>{it.name} × {it.qty}</span>
                <span>${(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="summary-card" style={{ height: 'fit-content' }}>
          <h2>Summary</h2>
          <div className="summary-row"><span>Items:</span><span>${order.itemsPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping:</span><span>${order.shippingPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax:</span><span>${order.taxPrice.toFixed(2)}</span></div>
          <div className="summary-row summary-total">
            <span>Total:</span><span>${order.totalPrice.toFixed(2)}</span>
          </div>
          {!order.isPaid && (
            <button className="btn btn-primary w-full mt-1" onClick={handlePay}>
              Mark as Paid (mock)
            </button>
          )}
          {user?.isAdmin && order.isPaid && !order.isDelivered && (
            <button className="btn btn-outline w-full mt-1" onClick={handleDeliver}>
              Mark Delivered
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
