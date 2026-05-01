import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Loader, Message } from '../components/Loader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keywordInput, setKeywordInput] = useState(searchParams.get('keyword') || '');

  const page = Number(searchParams.get('page')) || 1;
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products?keyword=${keyword}&page=${page}`);
        setProducts(data.products);
        setPages(data.pages);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (keywordInput) params.keyword = keywordInput;
    setSearchParams(params);
  };

  return (
    <>
      <section className="hero">
        <h1>Welcome to ShopMERN</h1>
        <p>Quality products at unbeatable prices</p>
      </section>

      <div className="flex-between mb-2" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ marginBottom: 0 }}>
          {keyword ? `Results for "${keyword}"` : 'Latest Products'}
        </h2>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products…"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : products.length === 0 ? (
        <Message>No products found.</Message>
      ) : (
        <>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          {pages > 1 && (
            <div className="flex gap-1 mt-2" style={{ justifyContent: 'center' }}>
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  className={
                    page === x + 1 ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'
                  }
                  onClick={() => {
                    const params = { page: String(x + 1) };
                    if (keyword) params.keyword = keyword;
                    setSearchParams(params);
                  }}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
