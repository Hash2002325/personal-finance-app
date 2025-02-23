import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Auth.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    
    try {
        const response = await api.post('/auth/login', formData);
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        onLogin(data);
        navigate('/dashboard');
    } catch (err) {
        console.error('Login error:', err);
        setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>Login</button>
        </form>
        <p className="auth-link">
          Don't have an account? <a onClick={() => navigate('/register')}>Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login; 