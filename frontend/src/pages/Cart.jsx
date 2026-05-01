import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Message } from '../components/Loader';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, itemsCount, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) navigate('/login', { state: { from: { pathname: '/checkout' } } });
    else navigate('/checkout');
  };

  return (
    <>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <Message>
          Your cart is empty. <Link to="/" style={{ color: 'var(--primary)' }}>Go shopping →</Link>
        </Message>
      ) : (
        <div className="row-split">
          <div>
            {cartItems.map((item) => (
              <div key={item.product} className="cart-row">
                <img src={item.image} alt={item.name} className="cart-image" />
                <Link to={`/product/${item.product}`} style={{ fontWeight: 500 }}>
                  {item.name}
                </Link>
                <div>${item.price.toFixed(2)}</div>
                <select
                  className="form-input"
                  style={{ width: 70 }}
                  value={item.qty}
                  onChange={(e) => updateQty(item.product, Number(e.target.value))}
                >
                  {[...Array(item.countInStock || 10).keys()].slice(0, 10).map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item.product)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="summary-card">
            <h2>Summary</h2>
            <div className="summary-row">
              <span>Items ({itemsCount}):</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Subtotal:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary w-full mt-1"
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
