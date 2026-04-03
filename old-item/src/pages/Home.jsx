import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import {
  FaLaptop, FaCouch, FaTshirt, FaBook, FaCar, FaFootballBall, FaSeedling, FaEllipsisH
} from 'react-icons/fa';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';
import { SkeletonCard } from '../components/Loader';
import './Home.css';

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


const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/items?limit=8&sort=newest');
        setFeaturedItems(data.items || []);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>
        <div className="container hero-container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">
              <FiZap /> The #1 Pre-Owned Marketplace
            </div>
            <h1 className="hero-title">
              Your Hub for <span className="gradient-text">Smart Trades</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing deals on pre-owned electronics, furniture, clothing, and more.
              Trade smarter — buy what you need, sell what you don't.
            </p>
            <div className="hero-actions">
              <Link to="/browse" className="btn btn-primary btn-lg" id="hero-browse-btn">
                Browse Items <FiArrowRight />
              </Link>
              <Link to="/sell" className="btn btn-secondary btn-lg" id="hero-sell-btn">
                Start Selling
              </Link>
            </div>
          </div>
          <div className="hero-visual animate-fade-in-delay-2">
            <div className="hero-card-stack">
              <div className="hero-floating-card hfc-1">
                <FaLaptop className="hfc-icon" />
                <span>MacBook Pro</span>
                <span className="hfc-price">₹45,000</span>
              </div>
              <div className="hero-floating-card hfc-2">
                <FaCouch className="hfc-icon" />
                <span>Sofa Set</span>
                <span className="hfc-price">₹12,000</span>
              </div>
              <div className="hero-floating-card hfc-3">
                <FaCar className="hfc-icon" />
                <span>Honda City</span>
                <span className="hfc-price">₹3,50,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" id="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by <span className="gradient-text">Category</span></h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="category-card glass-card"
                style={{ animationDelay: `${i * 0.05}s` }}
                id={`category-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div className="category-icon" style={{ color: cat.color, background: `${cat.color}15` }}>
                  <cat.icon />
                </div>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="section" id="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Latest <span className="gradient-text">Listings</span></h2>
              <p className="section-subtitle">Fresh items just added to the marketplace</p>
            </div>
            <Link to="/browse" className="btn btn-secondary" id="view-all-btn">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="items-grid">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="items-grid">
              {featuredItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No items listed yet. Be the first to <Link to="/sell" className="gradient-text">sell something!</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to Join the Hub?</h2>
            <p className="cta-subtitle">List your items in minutes and reach thousands of buyers</p>
            <Link to="/sell" className="btn btn-primary btn-lg" id="cta-sell-btn">
              Start Selling Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
