import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiPackage, FiDollarSign, FiCheckCircle, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMyItems();
  }, [user]);

  const fetchMyItems = async () => {
    try {
      const { data } = await API.get(`/items/user/${user._id}`);
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/items/${itemId}`);
      setItems(prev => prev.filter(item => item._id !== itemId));
      toast.success('Item deleted');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleToggleSold = async (itemId, currentStatus) => {
    try {
      await API.put(`/items/${itemId}`, { isSold: !currentStatus });
      setItems(prev => prev.map(item =>
        item._id === itemId ? { ...item, isSold: !currentStatus } : item
      ));
      toast.success(!currentStatus ? 'Marked as sold' : 'Marked as available');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const totalListings = items.length;
  const activeListing = items.filter(i => !i.isSold).length;
  const soldItems = items.filter(i => i.isSold).length;
  const totalValue = items.reduce((sum, i) => sum + (i.price || 0), 0);

  if (loading) return <Loader fullPage />;

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header animate-fade-in">
          <div>
            <h1 className="dashboard-title">
              Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="dashboard-subtitle">Manage your listings and account</p>
          </div>
          <Link to="/sell" className="btn btn-primary" id="dashboard-sell-btn">
            <FiPlusCircle /> New Listing
          </Link>
        </div>

        {/* Stats */}
        <div className="dashboard-stats animate-fade-in-delay-1">
          <div className="dash-stat-card glass-card">
            <FiPackage className="dash-stat-icon" />
            <div className="dash-stat-value">{totalListings}</div>
            <div className="dash-stat-label">Total Listings</div>
          </div>
          <div className="dash-stat-card glass-card">
            <FiCheckCircle className="dash-stat-icon" style={{ color: 'var(--accent-emerald)' }} />
            <div className="dash-stat-value">{activeListing}</div>
            <div className="dash-stat-label">Active</div>
          </div>
          <div className="dash-stat-card glass-card">
            <FiDollarSign className="dash-stat-icon" style={{ color: 'var(--accent-amber)' }} />
            <div className="dash-stat-value">{soldItems}</div>
            <div className="dash-stat-label">Sold</div>
          </div>
          <div className="dash-stat-card glass-card">
            <FiDollarSign className="dash-stat-icon" style={{ color: 'var(--accent-purple)' }} />
            <div className="dash-stat-value">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: items[0]?.currency || 'INR', maximumFractionDigits: 0 }).format(totalValue)}</div>
            <div className="dash-stat-label">Total Value</div>
          </div>
        </div>

        {/* Listings */}
        <div className="dashboard-listings animate-fade-in-delay-2">
          <h2 className="dashboard-section-title">Your Listings</h2>

          {items.length === 0 ? (
            <div className="empty-dashboard glass-card">
              <FiPackage className="empty-icon" />
              <h3>No listings yet</h3>
              <p>Start selling by creating your first listing</p>
              <Link to="/sell" className="btn btn-primary">
                <FiPlusCircle /> Create Listing
              </Link>
            </div>
          ) : (
            <div className="listings-table-wrapper glass-card">
              <table className="listings-table" id="listings-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const imageUrl = item.images?.[0]
                      ? (item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000${item.images[0]}`)
                      : null;
                    return (
                      <tr key={item._id}>
                        <td>
                          <div className="listing-item-cell">
                            {imageUrl ? (
                              <img src={imageUrl} alt={item.title} className="listing-thumb" />
                            ) : (
                              <div className="listing-thumb listing-thumb-placeholder">📦</div>
                            )}
                            <span className="listing-title">{item.title}</span>
                          </div>
                        </td>
                        <td><span className="listing-category">{item.category}</span></td>
                        <td className="listing-price">{item.price != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: item.currency || 'INR', maximumFractionDigits: 0 }).format(item.price) : ''}</td>
                        <td>
                          <button
                            className={`badge ${item.isSold ? 'badge-sold' : 'badge-new'}`}
                            onClick={() => handleToggleSold(item._id, item.isSold)}
                            style={{ cursor: 'pointer' }}
                          >
                            {item.isSold ? 'Sold' : 'Active'}
                          </button>
                        </td>
                        <td className="listing-date">
                          {new Date(item.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          <div className="listing-actions">
                            <Link to={`/item/${item._id}`} className="btn btn-secondary btn-sm btn-icon" title="View">
                              <FiEye />
                            </Link>
                            <Link to={`/edit/${item._id}`} className="btn btn-secondary btn-sm btn-icon" title="Edit">
                              <FiEdit />
                            </Link>
                            <button
                              className="btn btn-danger btn-sm btn-icon"
                              onClick={() => handleDelete(item._id)}
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
