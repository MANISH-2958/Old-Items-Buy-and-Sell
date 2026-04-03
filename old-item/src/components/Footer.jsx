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
            <Link to="/" className="footer-logo">
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
            <h4 className="footer-title">Quick Links</h4>
            <Link to="/browse" className="footer-link">Browse Items</Link>
            <Link to="/sell" className="footer-link">Sell an Item</Link>
            <Link to="/browse?category=Electronics" className="footer-link">Electronics</Link>
            <Link to="/browse?category=Furniture" className="footer-link">Furniture</Link>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4 className="footer-title">Categories</h4>
            <Link to="/browse?category=Clothing" className="footer-link">Clothing</Link>
            <Link to="/browse?category=Books" className="footer-link">Books</Link>
            <Link to="/browse?category=Vehicles" className="footer-link">Vehicles</Link>
            <Link to="/browse?category=Sports" className="footer-link">Sports</Link>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            <p className="footer-description" style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }}>Contact the developers directly.</p>
            <div className="footer-contact">
              <FiMail />
              <span>manishmanish5006@gmail.com</span>
            </div>
            <div className="footer-contact">
              <FiMail />
              <span>thanish914@gmail.com</span>
            </div>
            <div className="footer-contact">
              <FiMail />
              <span>shreedhyanvg7@gmail.com</span>
            </div>
            <div className="footer-contact">
              <FiMail />
              <span>tanzilsheiks100@gmail.com</span>
            </div>
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
