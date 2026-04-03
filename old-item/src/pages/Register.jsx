import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill in all required fields');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.location
      );
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <h1 className="auth-title">Create <span className="gradient-text">Account</span></h1>
            <p className="auth-subtitle">Join TradeHub to start buying & selling</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="register-form">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-icon-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input input-with-icon"
                  placeholder="John Doe"
                  id="register-name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-icon-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input input-with-icon"
                  placeholder="you@example.com"
                  id="register-email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="input-icon-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input input-with-icon"
                    placeholder="Min 6 characters"
                    id="register-password"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div className="input-icon-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input input-with-icon"
                    placeholder="••••••••"
                    id="register-confirm-password"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-icon-wrapper">
                  <FiPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input input-with-icon"
                    placeholder="+91 98765 43210"
                    id="register-phone"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <div className="input-icon-wrapper">
                  <FiMapPin className="input-icon" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input input-with-icon"
                    placeholder="City, State"
                    id="register-location"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
              id="register-submit"
            >
              {loading ? 'Creating Account...' : 'Create Account'} <FiArrowRight />
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="gradient-text">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
