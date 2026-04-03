import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <h4 className="footer-title">About Us</h4>
            </Link>
            <Link to="/" className="footer-logo" style={{ marginBottom: '1rem', display: 'flex' }}>
              <img src="/logo.png" alt="TradeHub" className="logo-img" />
              <span className="logo-text">TradeHub</span>
            </Link>
            <p className="footer-description">
              Your trusted hub for buying and selling pre-owned items. 
              Trade smarter — find great deals or give your items a new home.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <Link to="/quick-links" style={{ textDecoration: 'none' }}>
              <h4 className="footer-title">Quick Links</h4>
            </Link>
            <Link to="/browse" className="footer-link">Browse Items</Link>
            <Link to="/sell" className="footer-link">Sell an Item</Link>
            <Link to="/browse?category=Electronics" className="footer-link">Electronics</Link>
            <Link to="/browse?category=Furniture" className="footer-link">Furniture</Link>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <Link to="/categories" style={{ textDecoration: 'none' }}>
              <h4 className="footer-title">Categories</h4>
            </Link>
            <Link to="/browse?category=Clothing" className="footer-link">Clothing</Link>
            <Link to="/browse?category=Books" className="footer-link">Books</Link>
            <Link to="/browse?category=Vehicles" className="footer-link">Vehicles</Link>
            <Link to="/browse?category=Sports" className="footer-link">Sports</Link>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <h4 className="footer-title">Contact Us</h4>
            </Link>
            <p className="footer-description" style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }}>Contact the developers directly. Click below to view contact details.</p>
            <Link to="/contact" className="footer-link" style={{ marginTop: '0.5rem', display: 'inline-block', fontStyle: 'italic' }}>View Emails &rarr;</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TradeHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
