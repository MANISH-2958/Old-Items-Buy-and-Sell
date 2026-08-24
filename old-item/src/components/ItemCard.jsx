import { Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import './ItemCard.css';
import { API_BASE_URL } from '../api/axios';

const conditionBadgeClass = {
  'New': 'badge-new',
  'Like New': 'badge-like-new',
  'Good': 'badge-good',
  'Fair': 'badge-fair',
  'Poor': 'badge-poor',
};

const ItemCard = ({ item }) => {
const imageUrl = item.images && item.images.length > 0
  ? (item.images[0].startsWith('http')
      ? item.images[0]
      : `${API_BASE_URL || ''}${item.images[0]}`)
  : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <Link to={`/item/${item._id}`} className="item-card glass-card" id={`item-card-${item._id}`}>
      <div className="item-card-image-wrapper">
        <img
          src={imageUrl}
          alt={item.title}
          className="item-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {item.isSold && <span className="badge badge-sold sold-overlay">SOLD</span>}
        <span className={`badge ${conditionBadgeClass[item.condition] || 'badge-good'} condition-badge`}>
          {item.condition}
        </span>
      </div>
      <div className="item-card-body">
        <div className="item-card-category">{item.category}</div>
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-price">
          {item.price != null ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: item.currency || 'INR', maximumFractionDigits: 0 }).format(item.price) : ''}
        </p>
        {(item.location || item.seller?.location) && (
          <div className="item-card-location">
            <FiMapPin />
            <span>{item.location || item.seller?.location}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ItemCard;
