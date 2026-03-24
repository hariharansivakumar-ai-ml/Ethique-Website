import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus, FiFileText, FiRotateCcw, FiAlertTriangle } from 'react-icons/fi';
import { adminGetBlogs, adminDeleteBlog, adminRestoreBlog, adminPermanentDelete } from '../services/api';

const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5173';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft', 'trash'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadBlogs = () => {
    setLoading(true);
    adminGetBlogs()
      .then(res => setBlogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBlogs(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Move "${title}" to trash?`)) return;
    await adminDeleteBlog(id);
    loadBlogs();
  };

  const handleRestore = async (id) => {
    await adminRestoreBlog(id);
    loadBlogs();
  };

  const handlePermanentDelete = async (id, title) => {
    if (!window.confirm(`PERMANENTLY DELETE "${title}"? This cannot be undone.`)) return;
    await adminPermanentDelete(id);
    loadBlogs();
  };

  const filtered = blogs.filter(b => {
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'trash') {
      return matchSearch && b.is_deleted;
    }
    
    // Non-trash views only show non-deleted blogs
    if (b.is_deleted) return false;
    
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0e3d64', letterSpacing: -0.5 }}>Manage Blogs</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>
            {filter === 'trash' ? 'Viewing items in trash' : `Displaying ${filter} articles`}
          </p>
        </div>
        <button onClick={() => navigate('/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#0e9f6e,#057a55)', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(14,159,110,0.35)' }}>
          <FiPlus size={18} /> Add New
        </button>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 200 }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
            style={{ width: '100%', paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {/* Status filter */}
        <div style={{ display: 'flex', background: '#fff', padding: '4px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          {['all', 'published', 'draft', 'trash'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '0.5rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s', textTransform: 'capitalize',
                background: filter === f ? (f === 'trash' ? '#ef4444' : '#0e3d64') : 'transparent', color: filter === f ? '#fff' : '#64748b' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #0e9f6e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p>Syncing blogs...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['Article', 'Status', 'Date', 'SEO', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1.25rem 1.5rem', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog, i) => (
                <motion.tr key={blog.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid #f8fafc', background: blog.is_deleted ? '#fffafa' : '#fff' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#f1f5f9', border: '1px solid #f1f5f9' }}>
                        {blog.image_url ? <img src={blog.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiFileText size={20} color="#cbd5e1" /></div>}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#0e3d64', fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', gap: '0.5rem' }}>
                          <span>{blog.category}</span>
                          <span>•</span>
                          <span>{blog.author}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    {blog.is_deleted ? (
                      <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 800, background: '#fee2e2', color: '#dc2626', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><FiTrash2 size={10} /> Trashed</span>
                    ) : (
                      <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', background: blog.status === 'published' ? '#dcfce7' : '#fef3c7', color: blog.status === 'published' ? '#166534' : '#92400e' }}>{blog.status}</span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ width: 40, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${blog.seo_score || 0}%`, height: '100%', background: (blog.seo_score || 0) > 70 ? '#10b981' : '#f59e0b' }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginTop: 4, display: 'block' }}>{blog.seo_score || 0}%</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {blog.is_deleted ? (
                        <>
                          <button onClick={() => handleRestore(blog.id)} title="Restore"
                            style={{ padding: '0.5rem', color: '#0e9f6e', background: '#f0fdf4', border: 'none', cursor: 'pointer', borderRadius: 10 }}
                            onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'} onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}>
                            <FiRotateCcw size={16} />
                          </button>
                          <button onClick={() => handlePermanentDelete(blog.id, blog.title)} title="Delete Permanently"
                            style={{ padding: '0.5rem', color: '#ef4444', background: '#fef2f2', border: 'none', cursor: 'pointer', borderRadius: 10 }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'} onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
                            <FiAlertTriangle size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <a href={`${MAIN_SITE_URL}/blog/${blog.id}`} target="_blank" rel="noopener noreferrer"
                            style={{ padding: '0.5rem', color: '#64748b', background: '#f8fafc', border: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                            title="Preview" onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                            <FiEye size={16} />
                          </a>
                          <button onClick={() => navigate(`/edit/${blog.id}`)} title="Edit"
                            style={{ padding: '0.5rem', color: '#3b82f6', background: '#eff6ff', border: 'none', cursor: 'pointer', borderRadius: 10 }}
                            onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'} onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}>
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(blog.id, blog.title)} title="Move to Trash"
                            style={{ padding: '0.5rem', color: '#f59e0b', background: '#fffbeb', border: 'none', cursor: 'pointer', borderRadius: 10 }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fef3c7'} onMouseLeave={e => e.currentTarget.style.background = '#fffbeb'}>
                            <FiTrash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '6rem 4rem', textAlign: 'center' }}>
                    <div style={{ color: '#cbd5e1', marginBottom: '1rem' }}><FiFileText size={48} style={{ margin: '0 auto' }} /></div>
                    <p style={{ color: '#94a3b8', fontSize: 15, fontWeight: 500 }}>No articles found in this view.</p>
                    {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#0e9f6e', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>Clear Search</button>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
