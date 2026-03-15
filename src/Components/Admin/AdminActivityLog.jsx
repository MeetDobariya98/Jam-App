import React, { useEffect, useState, useCallback } from 'react';
import './Admin.css';
import DateFilter from './DateFilter';
import { API_URLS } from '../../api';
const token = () => localStorage.getItem('adminToken');

const actionIcon = {
  LOGIN: '🔓', BLOCK_USER: '🚫', UNBLOCK_USER: '✅',
  DELETE_USER: '👤', DELETE_POST: '📝', DELETE_COMMUNITY: '🏘️', RESOLVE_REPORT: '✅',
};
const ALL_ACTIONS = ['LOGIN','BLOCK_USER','UNBLOCK_USER','DELETE_USER','DELETE_POST','DELETE_COMMUNITY','RESOLVE_REPORT'];

const AdminActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate)              params.set('startDate', startDate);
    if (endDate)                params.set('endDate', endDate);
    if (actionFilter !== 'all') params.set('action', actionFilter);
    const res = await fetch(`${API_URLS.admin.activity}?${params}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    setLogs(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [startDate, endDate, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const actionDropdown = (
    <select
      className="date-extra-select"
      value={actionFilter}
      onChange={e => setActionFilter(e.target.value)}
    >
      <option value="all">All Actions</option>
      {ALL_ACTIONS.map(a => (
        <option key={a} value={a}>{actionIcon[a]} {a}</option>
      ))}
    </select>
  );

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-page-title">🕐 Admin Activity Log</h2>
          <p className="admin-page-sub">{logs.length} event{logs.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <DateFilter
        startDate={startDate} endDate={endDate}
        onStartDate={setStartDate} onEndDate={setEndDate}
        extra={actionDropdown}
      />

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading</div>
        ) : logs.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">🕐</span>
            No activity found for this filter
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Admin Email</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Browser</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l._id}>
                  <td>
                    <span className={`admin-badge ${l.action === 'LOGIN' ? 'badge-green' : l.action.includes('DELETE') ? 'badge-red' : 'badge-blue'}`}>
                      {actionIcon[l.action] || '⚙️'} {l.action}
                    </span>
                  </td>
                  <td>{l.email}</td>
                  <td><div className="post-content-preview">{l.details || '—'}</div></td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{l.ip}</td>
                  <td>
                    <div className="post-content-preview" style={{ maxWidth: '160px' }}>
                      {l.userAgent?.split(' ').slice(0, 3).join(' ')}…
                    </div>
                  </td>
                  <td style={{whiteSpace:'nowrap'}}>
                    {new Date(l.createdAt).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
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

export default AdminActivityLog;
