import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUser, FiMail, FiPhone, FiArrowLeft, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import './ItemDetail.css';

const conditionBadgeClass = {
  'New': 'badge-new',
  'Like New': 'badge-like-new',
  'Good': 'badge-good',
  'Fair': 'badge-fair',
  'Poor': 'badge-poor',
};

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await API.get(`/items/${id}`);
        setItem(data);
      } catch (error) {
        console.error('Failed to fetch item:', error);
        toast.error('Item not found');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setDeleting(true);
    try {
      await API.delete(`/items/${id}`);
      toast.success('Item deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkSold = async () => {
    try {
      await API.put(`/items/${id}`, { isSold: !item.isSold });
      setItem(prev => ({ ...prev, isSold: !prev.isSold }));
      toast.success(item.isSold ? 'Marked as available' : 'Marked as sold');
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  if (loading) return <Loader fullPage />;
  if (!item) return null;

  const images = item.images && item.images.length > 0
    ? item.images.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
    : ['https://via.placeholder.com/600x400?text=No+Image'];

  const isOwner = user && item.seller && user._id === item.seller._id;
  const sellerJoined = item.seller?.createdAt
    ? new Date(item.seller.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="item-detail-page">
      <div className="container">
        <Link to="/browse" className="back-link" id="back-to-browse">
          <FiArrowLeft /> Back to Browse
        </Link>

        <div className="item-detail-grid animate-fade-in">
          {/* Image Gallery */}
          <div className="item-gallery" id="item-gallery">
            <div className="gallery-main">
              <img
                src={images[currentImage]}
                alt={item.title}
                className="gallery-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
              />
              {item.isSold && <span className="badge badge-sold gallery-sold-badge">SOLD</span>}
              {images.length > 1 && (
                <>
                  <button
                    className="gallery-nav gallery-prev"
                    onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  >
                    <FiChevronLeft />
                  </button>
                  <button
                    className="gallery-nav gallery-next"
                    onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  >
                    <FiChevronRight />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb ${i === currentImage ? 'active' : ''}`}
                    onClick={() => setCurrentImage(i)}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Info */}
          <div className="item-info">
            <div className="item-info-header">
              <span className="item-category-tag">{item.category}</span>
              <span className={`badge ${conditionBadgeClass[item.condition]}`}>
                {item.condition}
              </span>
            </div>

            <h1 className="item-title">{item.title}</h1>

            <div className="item-price-row">
              <span className="item-price">{item.price != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: item.currency || 'INR', maximumFractionDigits: 0 }).format(item.price) : ''}</span>
            </div>

            {item.location && (
              <div className="item-meta">
                <FiMapPin /> {item.location}
              </div>
            )}

            <div className="item-meta">
              <FiCalendar /> Listed {new Date(item.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>

            <div className="item-description-section">
              <h3>Description</h3>
              <p className="item-description">{item.description}</p>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="owner-actions">
                <Link to={`/edit/${item._id}`} className="btn btn-secondary" id="edit-item-btn">
                  <FiEdit /> Edit Listing
                </Link>
                <button
                  className={`btn ${item.isSold ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={handleMarkSold}
                  id="mark-sold-btn"
                >
                  {item.isSold ? 'Mark as Available' : 'Mark as Sold'}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                  id="delete-item-btn"
                >
                  <FiTrash2 /> {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}

            {/* Seller Info Card */}
            <div className="seller-card glass-card" id="seller-info">
              <h3 className="seller-card-title">Seller Information</h3>
              <div className="seller-info-row">
                <div className="seller-avatar">
                  <FiUser />
                </div>
                <div>
                  <div className="seller-name">{item.seller?.name || 'Unknown'}</div>
                  {sellerJoined && <div className="seller-joined">Member since {sellerJoined}</div>}
                </div>
              </div>
              {item.seller?.email && (
                <button 
                  className="btn btn-primary seller-contact-btn" 
                  id="contact-seller-btn"
                  onClick={() => setShowEmail(!showEmail)}
                >
                  <FiMail /> {showEmail ? item.seller.email : 'Contact Seller'}
                </button>
              )}
              {item.seller?.phone && (
                <a href={`tel:${item.seller.phone}`} className="btn btn-secondary seller-contact-btn">
                  <FiPhone /> {item.seller.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
