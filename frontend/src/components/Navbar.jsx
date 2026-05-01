import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          🛒 ShopMERN
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/cart" className="nav-link">
            Cart
            {itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="nav-link">
                Orders
              </Link>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="nav-link"
                  style={{ color: 'var(--secondary)' }}
                >
                  Admin
                </Link>
              )}
              <span className="muted">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
