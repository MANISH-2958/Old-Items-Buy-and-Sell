import { useState, useEffect } from 'react';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/wishlist');
      setWishlists(data);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container"><Loader /></div>;

  return (
    <div className="page-container wishlist-page">
      <div className="container">
        <h1 className="page-title text-center">My Wishlist</h1>
        
        {wishlists.length === 0 ? (
          <div className="no-items glass-card">
            <p>You haven't wishlisted any items yet.</p>
          </div>
        ) : (
          <div className="items-grid">
            {wishlists.map((wishlist) => (
              <ItemCard key={wishlist._id} item={wishlist.item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
