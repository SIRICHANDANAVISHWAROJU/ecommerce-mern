import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, shippingAddress, saveShippingAddress, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  const taxPrice = +(itemsPrice * 0.08).toFixed(2);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = +(itemsPrice + taxPrice + shippingPrice).toFixed(2);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    saveShippingAddress({ address, city, postalCode, country });
    try {
      setLoading(true);
      const { data } = await api.post('/orders', {
        orderItems: cartItems.map((x) => ({
          name: x.name,
          qty: x.qty,
          image: x.image,
          price: x.price,
          product: x.product,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      clearCart();
      toast.success('Order placed!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Checkout</h1>
      <div className="row-split">
        <form onSubmit={handlePlaceOrder} className="summary-card">
          <h2>Shipping Address</h2>
          <div className="form-group">
            <label>Address</label>
            <input
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              className="form-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input
              className="form-input"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              className="form-input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <h2 className="mt-1">Payment Method</h2>
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {' '}Cash on Delivery
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="payment"
                value="Card"
                checked={paymentMethod === 'Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {' '}Card (mock)
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Placing order…' : 'Place Order'}
          </button>
        </form>

        <div className="summary-card" style={{ height: 'fit-content' }}>
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Items:</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping:</span><span>${shippingPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax (8%):</span><span>${taxPrice.toFixed(2)}</span></div>
          <div className="summary-row summary-total">
            <span>Total:</span><span>${totalPrice.toFixed(2)}</span>
          </div>
          <h3 className="mt-1">Items</h3>
          {cartItems.map((it) => (
            <div key={it.product} className="summary-row">
              <span>{it.name} × {it.qty}</span>
              <span>${(it.price * it.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Checkout;
