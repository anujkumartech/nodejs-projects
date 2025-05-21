import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Product Management</h1>
      </div>
      <ul className="navbar-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Product List</Link>
        </li>
        <li className={location.pathname === '/add-product' ? 'active' : ''}>
          <Link to="/add-product">Add Product</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;