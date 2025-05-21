import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductTable.css';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);

  const API_BASE_URL = 'http://localhost:5005/api/products';

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL); // fetch
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching products. Please try again later.');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  const fetchProductById = async (id) => {
    if (!id.trim()) {
      fetchAllProducts();
      return;
    }

    try {
      setLoading(true);
      setSearching(true);
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      const productData = response.data.data;
      if (Array.isArray(productData)) {
        setProducts(productData);
      } else {
        setProducts([productData]);
      }
      setLoading(false);
      setSearching(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setProducts([]);
        setError(`No product found with ID: ${id}`);
      } else {
        setError('Error searching for product. Please try again.');
        console.error('Error searching for product:', err);
      }
      setLoading(false);
      setSearching(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        if (searchId && products.length === 1) {
          setSearchId('');
          fetchAllProducts();
        } else {
          setProducts(products.filter(product => product._id !== id));
        }
        alert('Product deleted successfully!');
      } catch (err) {
        alert('Failed to delete product. Please try again.');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProductById(searchId);
  };

  const clearSearch = () => {
    setSearchId('');
    setError(null);
    fetchAllProducts();
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-table-container">
      <div className="table-header">
        <h2>Product List</h2>
        <div className="table-actions">
          <Link to="/add-product" className="add-product-btn">
            Add New Product
          </Link>
        </div>
      </div>
      
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by product ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
          {searchId && (
            <button type="button" className="clear-btn" onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {products.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>
          {searchId && (
            <button className="show-all-btn" onClick={clearSearch}>
              Show All Products
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Original Price</th>
                <th>Discount</th>
                <th>Final Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.productId}</td>
                  <td>{product.name}</td>
                  <td className="description-cell">
                    {product.description || 'No description'}
                  </td>
                  <td>${product.price}</td>
                  <td>{product.discount || 0}%</td>
                  <td className="discounted-price">
                    ${calculateDiscountedPrice(product.price, product.discount || 0)}
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(product.productId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductTable;