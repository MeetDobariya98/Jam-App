import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { API_URLS } from '../../api';
const token = () => localStorage.getItem('adminToken');

const BASE = '/jam-admin-x7k';

const StatCard = ({ icon, label, value, hint, color, to }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`admin-stat-card ${color}`}
      onClick={() => navigate(to)}
      title={`Click to view ${label}`}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value ?? '—'}</div>
        <div className="stat-label">{label}</div>
        {hint && <div className="stat-hint">↗ Click to manage</div>}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API_URLS.admin.stats, {
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { setStats(d); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <div className="admin-loading">Loading stats</div>;
  if (error)   return <div className="admin-empty"><span className="admin-empty-icon">⚠️</span>Error: {error}</div>;

  const maxVal = stats?.chartData
    ? Math.max(...stats.chartData.flatMap(d => [d.users, d.posts]), 1)
    : 1;

  return (
    <div className="admin-dashboard">
      <h2 className="admin-page-title">📊 Dashboard Overview</h2>
      <p className="admin-page-sub">Real-time metrics — click any card to manage</p>

      <div className="admin-stat-grid">
        <StatCard icon="👤" label="Users Joined Today" value={stats?.usersToday}    color="blue"   to={`${BASE}/users`}       hint />
        <StatCard icon="👥" label="Total Users"         value={stats?.totalUsers}    color="purple" to={`${BASE}/users`}       hint />
        <StatCard icon="📝" label="Posts Today"         value={stats?.postsToday}    color="green"  to={`${BASE}/posts`}       hint />
        <StatCard icon="📄" label="Total Posts"         value={stats?.totalPosts}    color="teal"   to={`${BASE}/posts`}       hint />
        <StatCard icon="🏘️" label="Communities"         value={stats?.totalCommunities} color="orange" to={`${BASE}/communities`} hint />
        <StatCard icon="🚨" label="Pending Reports"     value={stats?.pendingReports} color="red"   to={`${BASE}/reports`}    hint />
      </div>

      <div className="admin-charts-row">
        {/* 7-day bar chart */}
        <div className="admin-chart-card">
          <h3>📈 7-Day Activity</h3>
          <div className="chart-bars">
            {stats?.chartData?.map((d, i) => (
              <div key={i} className="chart-day">
                <div className="chart-bar-wrap">
                  <div
                    className="chart-bar users-bar"
                    style={{ height: `${Math.max((d.users / maxVal) * 110, d.users > 0 ? 6 : 0)}px` }}
                    title={`${d.users} users`}
                  />
                  <div
                    className="chart-bar posts-bar"
                    style={{ height: `${Math.max((d.posts / maxVal) * 110, d.posts > 0 ? 6 : 0)}px` }}
                    title={`${d.posts} posts`}
                  />
                </div>
                <div className="chart-label">{d.date}</div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span><span className="legend-dot users-dot" /> Users</span>
            <span><span className="legend-dot posts-dot" /> Posts</span>
          </div>
        </div>

        {/* Instrument breakdown */}
        <div className="admin-chart-card">
          <h3>🎸 Instrument Breakdown</h3>
          {stats?.instrumentStats?.length > 0 ? (
            <div className="instrument-list">
              {stats.instrumentStats.slice(0, 8).map((s, i) => (
                <div key={i} className="instrument-row">
                  <span className="inst-name">{s._id || 'Unknown'}</span>
                  <div className="inst-bar-wrap">
                    <div
                      className="inst-bar"
                      style={{ width: `${Math.round((s.count / (stats.totalUsers || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="inst-count">{s.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-empty" style={{padding:'20px 0'}}>No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
