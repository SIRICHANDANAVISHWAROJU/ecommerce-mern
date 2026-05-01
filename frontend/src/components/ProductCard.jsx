import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link to={`/product/${product._id}`} className="card">
    <img
      src={product.image}
      alt={product.name}
      className="product-image"
      onError={(e) => {
        e.target.src = 'https://via.placeholder.com/400x400?text=Product';
      }}
    />
    <div className="product-body">
      <div className="muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
        {product.brand}
      </div>
      <h3 className="product-title">{product.name}</h3>
      <div className="flex-between mt-1">
        <div className="product-price">${product.price.toFixed(2)}</div>
        <div className="muted">⭐ {product.rating}</div>
      </div>
      {product.countInStock === 0 && (
        <div className="badge badge-danger mt-1">Out of stock</div>
      )}
    </div>
  </Link>
);

export default ProductCard;
