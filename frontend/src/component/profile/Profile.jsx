import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Profile.css';

function Profile({ user, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currency: user.currency || 'LKR',
    theme: user.theme || 'light'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currencies = [
    { value: 'LKR', label: 'Sri Lankan Rupee (LKR)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'INR', label: 'Indian Rupee (INR)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' }
  ];

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/auth/profile', formData);
      const updatedUser = response.data.data;
      onUpdateProfile(updatedUser);
      setSuccess('Profile updated successfully');
      
      // Comment out theme application
      /*
      document.documentElement.setAttribute('data-theme', formData.theme);
      localStorage.setItem('theme', formData.theme);
      */
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="profile-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
            }}
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="currency">Preferred Currency</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              disabled
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              disabled
            >
              {themes.map(theme => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="update-button"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile; 