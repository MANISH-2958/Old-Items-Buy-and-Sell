import { Link } from 'react-router-dom';
import { FiGrid, FiMail, FiMapPin, FiHeart } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <FiGrid />
              </div>
              <span className="logo-text">OldMart</span>
            </Link>
            <p className="footer-description">
              Your trusted marketplace for buying and selling pre-owned items. 
              Find great deals or give your old items a new life.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="GitHub"><FaGithub /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
            </div>
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
            <div className="footer-contact">
              <FiMail />
              <span>support@oldmart.com</span>
            </div>
            <div className="footer-contact">
              <FiMapPin />
              <span>India</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} OldMart. Made with <FiHeart className="heart-icon" /> for second chances.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
