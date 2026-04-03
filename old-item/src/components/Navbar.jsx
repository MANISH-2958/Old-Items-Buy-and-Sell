import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiMenu, FiX, FiPlusCircle, FiUser, FiLogOut, FiGrid, FiHome, FiHeart, FiMessageSquare } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <img src="/logo.png" alt="TradeHub" className="logo-img" />
          <span className="logo-text">TradeHub</span>
        </Link>

        {/* Search Bar - Desktop */}
        <form className="navbar-search" onSubmit={handleSearch} id="navbar-search-form">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="navbar-search-input"
          />
        </form>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link" id="nav-home">
            <FiHome /> Home
          </Link>
          <Link to="/browse" className="nav-link" id="nav-browse">
            <FiGrid /> Browse
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/sell" className="btn btn-primary btn-sm" id="nav-sell-btn">
                <FiPlusCircle /> Sell Item
              </Link>
              <Link to="/wishlist" className="nav-link" id="nav-wishlist">
                <FiHeart /> Wishlist
              </Link>
              <Link to="/messages" className="nav-link" id="nav-messages">
                <FiMessageSquare /> Messages
              </Link>
              <Link to="/dashboard" className="nav-link" id="nav-dashboard">
                <FiUser /> {user?.name?.split(' ')[0]} <span style={{opacity: 0.7, fontSize: '0.9em', marginLeft: '4px'}}>({user?.email})</span>
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn" id="nav-logout-btn">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="nav-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          id="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu animate-slide-down" id="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
          <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>
            <FiHome /> Home
          </Link>
          <Link to="/browse" className="mobile-link" onClick={() => setMenuOpen(false)}>
            <FiGrid /> Browse
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/sell" className="mobile-link" onClick={() => setMenuOpen(false)}>
                <FiPlusCircle /> Sell Item
              </Link>
              <Link to="/wishlist" className="mobile-link" onClick={() => setMenuOpen(false)}>
                <FiHeart /> Wishlist
              </Link>
              <Link to="/messages" className="mobile-link" onClick={() => setMenuOpen(false)}>
                <FiMessageSquare /> Messages
              </Link>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>
                <FiUser /> {user?.name?.split(' ')[0]} <span style={{opacity: 0.7, fontSize: '0.9em'}}>({user?.email})</span>
              </Link>
              <button onClick={handleLogout} className="mobile-link logout-btn">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-link" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
