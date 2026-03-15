import React, { useEffect, useState, useCallback } from 'react';
import './Admin.css';
import DateFilter from './DateFilter';
import { API_URLS } from '../../api';
const token = () => localStorage.getItem('adminToken');

const AdminCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)    params.set('search', search);
    if (startDate) params.set('startDate', startDate);
    if (endDate)   params.set('endDate', endDate);
    const res = await fetch(`${API_URLS.admin.communities}?${params}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    setCommunities(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, startDate, endDate]);

  useEffect(() => { fetchCommunities(); }, [fetchCommunities]);

  const deleteCommunity = async (id) => {
    if (!window.confirm('Delete this community permanently?')) return;
    await fetch(`${API_BASE_URL}/api/admin/communities/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });
    fetchCommunities();
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-page-title">🏘️ Community Management</h2>
          <p className="admin-page-sub">{communities.length} communit{communities.length !== 1 ? 'ies' : 'y'} found</p>
        </div>
        <input
          className="admin-search"
          placeholder="🔍 Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <DateFilter
        startDate={startDate} endDate={endDate}
        onStartDate={setStartDate} onEndDate={setEndDate}
      />

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading</div>
        ) : communities.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">🏘️</span>
            No communities found for this filter
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Name</th>
                <th>Description</th>
                <th>Admin</th>
                <th>Members</th>
                <th>Posts</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {communities.map(c => (
                <tr key={c._id}>
                  <td>
                    {c.coverImage
                      ? <img src={c.coverImage} alt="" className="admin-community-cover" />
                      : <div className="admin-community-cover-placeholder">🎵</div>}
                  </td>
                  <td><strong>{c.name}</strong></td>
                  <td>
                    <div className="post-content-preview">
                      {c.description?.slice(0, 60)}{c.description?.length > 60 ? '…' : ''}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{c.admin?.name}</div>
                      <div style={{ fontSize: '11px', opacity: 0.5 }}>{c.admin?.email}</div>
                    </div>
                  </td>
                  <td>{c.members?.length || 0}</td>
                  <td>{c.posts?.length || 0}</td>
                  <td style={{whiteSpace:'nowrap'}}>{new Date(c.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                  <td>
                    <button className="admin-btn btn-danger" onClick={() => deleteCommunity(c._id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCommunities;
