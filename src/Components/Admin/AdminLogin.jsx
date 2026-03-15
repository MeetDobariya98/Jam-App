import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { API_URLS } from '../../api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URLS.admin.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      navigate('/jam-admin-x7k/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg" />
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span className="admin-logo-icon">🎵</span>
          <h1>Jam Admin</h1>
          <p>Control Panel — Authorized Access Only</p>
        </div>
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-form-group">
            <label>Admin Email</label>
            <input
              type="email"
              placeholder="admin@jam.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="admin-error">{error}</div>}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? <span className="admin-spinner" /> : 'Sign In to Dashboard'}
          </button>
        </form>
        <p className="admin-login-footer">🔒 This page is not publicly accessible</p>
      </div>
    </div>
  );
};

export default AdminLogin;
