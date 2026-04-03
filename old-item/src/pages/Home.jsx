import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiSearch, FiMessageCircle, FiCheckCircle, FiShield, FiSmile, FiStar } from 'react-icons/fi';
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
            <div style={{ margin: '2.5rem 0', position: 'relative', display: 'inline-block' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(245,166,35,0.2) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 0 }}></div>
              <img src="/logo.png" alt="TradeHub Logo" style={{ height: '260px', objectFit: 'contain', filter: 'drop-shadow(0 0 25px rgba(245, 166, 35, 0.5)) drop-shadow(0 0 5px rgba(245, 166, 35, 0.8))', position: 'relative', zIndex: 1, borderRadius: '2rem' }} className="hero-logo" />
            </div>
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

      {/* How It Works */}
      <section className="section" id="how-it-works-section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
            <p className="section-subtitle">Your journey to smart trades in three simple steps</p>
          </div>
          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon-wrapper"><FiSearch /></div>
              <h3>List & Discover</h3>
              <p>Find the perfect item from thousands of listings, or easily snap a photo to list your own pre-owned goods.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon-wrapper"><FiMessageCircle /></div>
              <h3>Connect & Negotiate</h3>
              <p>Use our trusted platform to contact sellers seamlessly. Ask questions, negotiate terms, and agree on a deal.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon-wrapper"><FiCheckCircle /></div>
              <h3>Trade & Enjoy</h3>
              <p>Complete the transaction securely. Give your pre-owned items a new home or enjoy your amazing finds!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" id="features-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2 className="section-title">Why Choose <span className="gradient-text">TradeHub</span></h2>
            <p className="section-subtitle">The most reliable platform for trading pre-owned items</p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon"><FiShield /></div>
              <h4>Verified & Secure</h4>
              <p>Every transaction and user profile is carefully monitored to ensure a safe, scam-free environment for everyone.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><FaSeedling /></div>
              <h4>Eco-Friendly Choice</h4>
              <p>By buying and selling pre-owned items, you are actively reducing waste and contributing to a sustainable future.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon"><FiSmile /></div>
              <h4>Seamless Experience</h4>
              <p>Our intuitive UI makes it faster and more enjoyable than ever to browse, discover, and list your goods.</p>
            </div>
          </div>
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
