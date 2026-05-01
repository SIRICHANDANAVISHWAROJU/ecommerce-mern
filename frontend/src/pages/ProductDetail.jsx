import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Loader, Message } from '../components/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart`);
    navigate('/cart');
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!product) return null;

  return (
    <>
      <Link to="/" className="btn btn-outline btn-sm mb-2">
        ← Back to products
      </Link>
      <div className="row-split">
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{ borderRadius: 8, maxHeight: 500, objectFit: 'cover', width: '100%' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=Product';
            }}
          />
          <div className="mt-2">
            <h1>{product.name}</h1>
            <p className="muted">{product.brand} · {product.category}</p>
            <p className="mt-1">⭐ {product.rating} ({product.numReviews} reviews)</p>
            <p className="mt-2">{product.description}</p>
          </div>
        </div>
        <div>
          <div className="summary-card">
            <div className="summary-row">
              <span>Price:</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                ${product.price.toFixed(2)}
              </strong>
            </div>
            <div className="summary-row">
              <span>Status:</span>
              <span
                className={
                  product.countInStock > 0
                    ? 'badge badge-success'
                    : 'badge badge-danger'
                }
              >
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {product.countInStock > 0 && (
              <div className="summary-row">
                <span>Quantity:</span>
                <select
                  className="form-input"
                  style={{ width: 80 }}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              className="btn btn-primary w-full mt-1"
              disabled={product.countInStock === 0}
              onClick={handleAddToCart}
            >
              {product.countInStock === 0 ? 'Unavailable' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
