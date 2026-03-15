import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Admin.css';

const BASE = '/jam-admin-x7k';

const nav = [
  { to: `${BASE}/dashboard`,   icon: '📊', label: 'Dashboard' },
  { to: `${BASE}/users`,       icon: '👥', label: 'Users' },
  { to: `${BASE}/posts`,       icon: '📝', label: 'Posts' },
  { to: `${BASE}/communities`, icon: '🏘️', label: 'Communities' },
  { to: `${BASE}/reports`,     icon: '🚨', label: 'Reports' },
  { to: `${BASE}/activity`,    icon: '🕐', label: 'Activity Log' },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/jam-admin-x7k');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <span>🎵</span>
          <span>Jam Admin</span>
        </div>
        <nav className="admin-nav">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <div className="admin-header-title">Jam Admin Panel</div>
          </div>
          <div className="admin-header-user">
            <div className="admin-avatar">
              {admin.profilePhoto
                ? <img src={admin.profilePhoto} alt="admin" />
                : <span>{admin.name?.[0] || 'A'}</span>}
            </div>
            <div>
              <div className="admin-header-name">{admin.name} {admin.lastname}</div>
              <div className="admin-header-role">Administrator</div>
            </div>
          </div>
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
