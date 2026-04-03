import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX, FiDollarSign, FiArrowLeft } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import './SellItem.css';

const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Sports', 'Home & Garden', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY', 'RUB'];

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'INR',
    category: '',
    condition: '',
    location: '',
  });
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await API.get(`/items/${id}`);
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          currency: data.currency || 'INR',
          category: data.category,
          condition: data.condition,
          location: data.location || '',
        });
        setExistingImages(data.images || []);
      } catch (error) {
        toast.error('Item not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const onDrop = useCallback((acceptedFiles) => {
    const totalImages = existingImages.length - removedImages.length + newImages.length;
    if (totalImages + acceptedFiles.length > 5) {
      return toast.error('Maximum 5 images allowed');
    }
    const allowed = acceptedFiles.slice(0, 5 - totalImages);
    setNewImages(prev => [...prev, ...allowed]);

    allowed.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, [existingImages, removedImages, newImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxSize: 5 * 1024 * 1024,
  });

  const removeExistingImage = (img) => {
    setRemovedImages(prev => [...prev, img]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.condition) {
      return toast.error('Please fill in all required fields');
    }

    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (removedImages.length > 0) {
        data.append('removedImages', JSON.stringify(removedImages));
      }
      newImages.forEach(img => data.append('images', img));

      await API.put(`/items/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Item updated successfully!');
      navigate(`/item/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage />;

  const activeExistingImages = existingImages.filter(img => !removedImages.includes(img));

  return (
    <div className="sell-page">
      <div className="container">
        <div className="sell-container animate-fade-in">
          <button onClick={() => navigate(-1)} className="back-link" style={{ marginBottom: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <FiArrowLeft /> Back
          </button>
          <div className="sell-header">
            <h1 className="sell-title">Edit <span className="gradient-text">Listing</span></h1>
            <p className="sell-subtitle">Update your item details</p>
          </div>

          <form onSubmit={handleSubmit} className="sell-form glass-card" id="edit-form">
            {/* Existing Images */}
            {activeExistingImages.length > 0 && (
              <div className="form-group">
                <label className="form-label">Current Photos</label>
                <div className="image-previews">
                  {activeExistingImages.map((img, i) => (
                    <div key={i} className="preview-item">
                      <img src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt={`Current ${i + 1}`} />
                      <button type="button" className="preview-remove" onClick={() => removeExistingImage(img)}>
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div className="form-group">
              <label className="form-label">Add New Photos</label>
              <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}>
                <input {...getInputProps()} />
                <FiUploadCloud className="dropzone-icon" />
                <p className="dropzone-text">
                  {isDragActive ? 'Drop images here' : 'Drag & drop or click to add more images'}
                </p>
              </div>
              {newPreviews.length > 0 && (
                <div className="image-previews">
                  {newPreviews.map((preview, i) => (
                    <div key={i} className="preview-item">
                      <img src={preview} alt={`New ${i + 1}`} />
                      <button type="button" className="preview-remove" onClick={() => removeNewImage(i)}>
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" id="edit-title" />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows={5} id="edit-description" />
            </div>

            <div className="form-group">
              <label className="form-label">Price *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="form-input"
                  style={{ width: '120px' }}
                  id="edit-currency"
                >
                  {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="input-icon-wrapper" style={{ flex: 1 }}>
                  <FiDollarSign className="input-icon" />
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input input-with-icon" min="0" placeholder="Enter price" id="edit-price" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-input" id="edit-category">
                  <option value="">Select</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="form-input" id="edit-condition">
                  <option value="">Select</option>
                  {conditions.map(con => <option key={con} value={con}>{con}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" id="edit-location" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={saving} id="edit-submit">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
