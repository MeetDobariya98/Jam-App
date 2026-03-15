import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import DateFilter from './DateFilter';
import { API_URLS } from '../../api';
const token = () => localStorage.getItem('adminToken');

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search)    params.set('search', search);
    if (startDate) params.set('startDate', startDate);
    if (endDate)   params.set('endDate', endDate);
    const res = await fetch(`${API_URLS.admin.users}?${params}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, startDate, endDate]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const blockUser = async (id, isBlocked) => {
    const route = isBlocked ? API_URLS.admin.unblock(id) : API_URLS.admin.block(id);
    await fetch(route, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token()}` },
    });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await fetch(API_URLS.admin.deleteUser(id), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });
    fetchUsers();
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-page-title">👥 User Management</h2>
          <p className="admin-page-sub">{users.length} user{users.length !== 1 ? 's' : ''} found</p>
        </div>
        <input
          className="admin-search"
          placeholder="🔍 Search by name or email…"
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
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">👥</span>
            No users found for this filter
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Instrument</th>
                <th>Location</th>
                <th>Status</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-user-cell">
                      {u.profilePhoto
                        ? <img src={u.profilePhoto} alt="" className="admin-user-avatar" />
                        : <div className="admin-user-avatar-placeholder">{u.name?.[0]}</div>}
                      <span>{u.name} {u.lastname}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.instrument}</td>
                  <td>{u.city}, {u.state}</td>
                  <td>
                    <span className={`admin-badge ${u.isBlocked ? 'badge-red' : 'badge-green'}`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${u.role === 'admin' ? 'badge-purple' : 'badge-gray'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-btn btn-blue"
                        onClick={() => navigate(`/jam-admin-x7k/posts?userId=${u._id}&userName=${encodeURIComponent(u.name + ' ' + u.lastname)}`)}
                      >
                        Posts
                      </button>
                      <button
                        className={`admin-btn ${u.isBlocked ? 'btn-success' : 'btn-warning'}`}
                        onClick={() => blockUser(u._id, u.isBlocked)}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button className="admin-btn btn-danger" onClick={() => deleteUser(u._id)}>
                        Delete
                      </button>
                    </div>
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

export default AdminUsers;
