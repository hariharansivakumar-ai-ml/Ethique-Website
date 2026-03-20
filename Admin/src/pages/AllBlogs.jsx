import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus, FiFileText } from 'react-icons/fi';
import { adminGetBlogs, adminDeleteBlog } from '../services/api';

const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL || 'http://localhost:5173';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
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

  const filtered = blogs.filter(b => {
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0e3d64', letterSpacing: -0.5 }}>All Blogs</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>{blogs.length} total article{blogs.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => navigate('/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#0e9f6e,#057a55)', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(14,159,110,0.35)' }}>
          <FiPlus size={18} /> Add New
        </button>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 200 }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blogs..."
            style={{ width: '100%', paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {/* Status filter */}
        {['all', 'published', 'draft'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '0.6rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s', textTransform: 'capitalize',
              background: filter === f ? '#0e3d64' : '#fff', color: filter === f ? '#fff' : '#64748b', boxShadow: filter === f ? '0 2px 8px rgba(0,0,0,0.12)' : 'none' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', overflow: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                {['Post', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog, i) => (
                <motion.tr key={blog.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#f1f5f9' }}>
                        {blog.image_url ? <img src={blog.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiFileText size={18} color="#cbd5e1" /></div>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0e3d64', fontSize: 14, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>By {blog.author}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: '#f1f5f9', color: '#64748b', textTransform: 'uppercase' }}>{blog.category}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', background: blog.status === 'published' ? '#f0fdf4' : '#fffbeb', color: blog.status === 'published' ? '#0e9f6e' : '#d97706' }}>{blog.status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: 13, color: '#64748b' }}>
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                      <a href={`${MAIN_SITE_URL}/blog/${blog.id}`} target="_blank" rel="noopener noreferrer"
                        style={{ padding: '0.4rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                        title="View" onMouseEnter={e => e.currentTarget.style.color = '#0e9f6e'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                        <FiEye size={17} />
                      </a>
                      <button onClick={() => navigate(`/edit/${blog.id}`)} title="Edit"
                        style={{ padding: '0.4rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                        <FiEdit2 size={17} />
                      </button>
                      <button onClick={() => handleDelete(blog.id, blog.title)} title="Move to Trash"
                        style={{ padding: '0.4rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                    No blogs found. {search && 'Try a different search.'} 
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
