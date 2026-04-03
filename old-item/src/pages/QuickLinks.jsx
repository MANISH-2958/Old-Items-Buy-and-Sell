import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlusCircle, FiList, FiHome } from 'react-icons/fi';
import './StaticPage.css';

const QuickLinks = () => {
  return (
    <div className="static-page animate-fade-in">
      <div className="container">
        <h1 className="page-title">Quick <span className="gradient-text">Links</span></h1>
        <div className="quick-links-grid">
          <Link to="/" className="quick-link-card glass-card">
            <FiHome className="ql-icon" />
            <h3>Home</h3>
            <p>Go back to the main dashboard and see featured listings.</p>
          </Link>
          <Link to="/browse" className="quick-link-card glass-card">
            <FiSearch className="ql-icon" />
            <h3>Browse Items</h3>
            <p>Explore all available items on the platform.</p>
          </Link>
          <Link to="/sell" className="quick-link-card glass-card">
            <FiPlusCircle className="ql-icon" />
            <h3>Sell an Item</h3>
            <p>Start selling your pre-owned items easily.</p>
          </Link>
          <Link to="/categories" className="quick-link-card glass-card">
            <FiList className="ql-icon" />
            <h3>Categories</h3>
            <p>View items organized by specific category fields.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
