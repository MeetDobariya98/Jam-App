import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Admin.css';
import DateFilter from './DateFilter';
import { API_URLS } from '../../api';
const token = () => localStorage.getItem('adminToken');

const AdminPosts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const userName = searchParams.get('userName');
  
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (userId)    params.set('author', userId);
    if (search)    params.set('search', search);
    if (startDate) params.set('startDate', startDate);
    if (endDate)   params.set('endDate', endDate);
    const res = await fetch(`${API_URLS.admin.posts}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token()}` },
    });
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [userId, search, startDate, endDate]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    await fetch(API_URLS.admin.deletePost(id), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token()}` },
    });
    fetchPosts();
  };

  const clearUserFilter = () => {
    searchParams.delete('userId');
    searchParams.delete('userName');
    setSearchParams(searchParams);
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-page-title">📝 Post Moderation</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p className="admin-page-sub">{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>
            {userId && (
              <div className="admin-badge badge-purple" style={{ cursor: 'pointer' }} onClick={clearUserFilter}>
                👤 User: {userName || userId} <span style={{ marginLeft: '4px', opacity: 0.6 }}>✕</span>
              </div>
            )}
          </div>
        </div>
        <input
          className="admin-search"
          placeholder="🔍 Search by content…"
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
        ) : posts.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">📝</span>
            No posts found for this filter
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Content</th>
                <th>Media</th>
                <th>Community</th>
                <th>Likes</th>
                <th>Comments</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-user-cell">
                      {p.author?.profilePhoto
                        ? <img src={p.author.profilePhoto} alt="" className="admin-user-avatar" />
                        : <div className="admin-user-avatar-placeholder">{p.author?.name?.[0] || '?'}</div>}
                      <div>
                        <div>{p.author?.name}</div>
                        <div style={{ fontSize: '11px', opacity: 0.5 }}>{p.author?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="post-content-preview">
                      {p.content ? p.content.slice(0, 80) + (p.content.length > 80 ? '…' : '') : <em style={{opacity:0.4}}>No text</em>}
                    </div>
                  </td>
                  <td>
                    <div className="admin-media-cell">
                      {p.media?.length > 0 ? (
                        p.media.map((m, idx) => (
                          m.type === 'image' ? (
                            <img
                              key={idx}
                              src={m.url}
                              alt=""
                              className="admin-media-thumb"
                              onClick={() => setSelectedMedia(m)}
                            />
                          ) : (
                            <div key={idx} className="admin-media-icon" onClick={() => setSelectedMedia(m)}>
                              {m.type === 'video' ? '📹' : '🎵'}
                            </div>
                          )
                        ))
                      ) : (
                        <span className="admin-badge badge-gray">None</span>
                      )}
                    </div>
                  </td>
                  <td>{p.community?.name || <span style={{opacity:0.4}}>—</span>}</td>
                  <td>{p.likes?.length || 0}</td>
                  <td>{p.comments?.length || 0}</td>
                  <td style={{whiteSpace:'nowrap'}}>{new Date(p.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                  <td>
                    <button className="admin-btn btn-danger" onClick={() => deletePost(p._id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedMedia && (
        <div className="admin-modal-overlay" onClick={() => setSelectedMedia(null)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setSelectedMedia(null)}>×</button>
            {selectedMedia.type === 'image' && (
              <img src={selectedMedia.url} alt="" className="admin-modal-media" />
            )}
            {selectedMedia.type === 'video' && (
              <video src={selectedMedia.url} controls autoPlay className="admin-modal-media" />
            )}
            {selectedMedia.type === 'audio' && (
              <audio src={selectedMedia.url} controls autoPlay style={{ width: '400px' }} />
            )}
            <div style={{ marginTop: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              Type: {selectedMedia.type.toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;
