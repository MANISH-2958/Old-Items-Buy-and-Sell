import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptop, FaCouch, FaTshirt, FaBook, FaCar, FaFootballBall, FaSeedling, FaEllipsisH } from 'react-icons/fa';
import './StaticPage.css';

const categories = [
  { name: 'Electronics', icon: FaLaptop, color: '#f5a623' },
  { name: 'Furniture', icon: FaCouch, color: '#2dd4bf' },
  { name: 'Clothing', icon: FaTshirt, color: '#f59e0b' },
  { name: 'Books', icon: FaBook, color: '#14b8a6' },
  { name: 'Vehicles', icon: FaCar, color: '#e08a12' },
  { name: 'Sports', icon: FaFootballBall, color: '#0d9488' },
  { name: 'Home & Garden', icon: FaSeedling, color: '#d4a017' },
  { name: 'Other', icon: FaEllipsisH, color: '#64748b' },
];

const CategoriesRoute = () => {
  return (
    <div className="static-page animate-fade-in">
      <div className="container">
        <h1 className="page-title">All <span className="gradient-text">Categories</span></h1>
        <div className="categories-route-grid">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/browse?category=${encodeURIComponent(cat.name)}`}
              className="category-card glass-card"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="category-icon" style={{ color: cat.color, background: `${cat.color}15` }}>
                <cat.icon />
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesRoute;
