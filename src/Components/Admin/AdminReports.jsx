import React, { useEffect, useState, useCallback } from 'react';
import './Admin.css';
import DateFilter from './DateFilter';
import { API_URLS } from '../../api';
const token = () => localStorage.getItem('adminToken');
const typeIcon = { user: '👤', post: '📝', community: '🏘️' };

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate)                params.set('startDate', startDate);
    if (endDate)                  params.set('endDate', endDate);
    if (statusFilter !== 'all')   params.set('status', statusFilter);
    const res = await fetch(`${API_URLS.admin.reports}?${params}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    setReports(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [startDate, endDate, statusFilter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const resolveReport = async (id) => {
    await fetch(API_URLS.admin.resolveReport(id), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token()}` },
    });
    fetchReports();
  };

  const pending  = reports.filter(r => r.status === 'pending').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;

  const statusDropdown = (
    <select
      className="date-extra-select"
      value={statusFilter}
      onChange={e => setStatusFilter(e.target.value)}
    >
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="resolved">Resolved</option>
    </select>
  );

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-page-title">🚨 Reports</h2>
          <p className="admin-page-sub">
            <span className="admin-badge badge-red" style={{marginRight:6}}>{pending} pending</span>
            <span className="admin-badge badge-green">{resolved} resolved</span>
          </p>
        </div>
      </div>

      <DateFilter
        startDate={startDate} endDate={endDate}
        onStartDate={setStartDate} onEndDate={setEndDate}
        extra={statusDropdown}
      />

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Loading</div>
        ) : reports.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">🚨</span>
            No reports found for this filter
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Type</th>
                <th>Reported ID</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r._id}>
                  <td>
                    <div className="admin-user-cell">
                      {r.reporterId?.profilePhoto
                        ? <img src={r.reporterId.profilePhoto} alt="" className="admin-user-avatar" />
                        : <div className="admin-user-avatar-placeholder">{r.reporterId?.name?.[0] || '?'}</div>}
                      <div>
                        <div>{r.reporterId?.name}</div>
                        <div style={{ fontSize: '11px', opacity: 0.5 }}>{r.reporterId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge badge-blue">
                      {typeIcon[r.reportedType]} {r.reportedType}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>…{r.reportedId?.toString().slice(-8)}</td>
                  <td><div className="post-content-preview">{r.reason}</div></td>
                  <td>
                    <span className={`admin-badge ${r.status === 'pending' ? 'badge-red' : 'badge-green'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{whiteSpace:'nowrap'}}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                  <td>
                    {r.status === 'pending' && (
                      <button className="admin-btn btn-success" onClick={() => resolveReport(r._id)}>
                        ✅ Resolve
                      </button>
                    )}
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

export default AdminReports;
