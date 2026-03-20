import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiRefreshCw, FiFileText } from 'react-icons/fi';
import { adminGetTrash, adminRestoreBlog, adminPermanentDelete } from '../services/api';

const Trash = () => {
  const [trashed, setTrashed] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTrash = () => {
    setLoading(true);
    adminGetTrash()
      .then(res => setTrashed(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTrash(); }, []);

  const handleRestore = async (id) => {
    await adminRestoreBlog(id);
    loadTrash();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete "${title}"? This cannot be undone.`)) return;
    await adminPermanentDelete(id);
    loadTrash();
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0e3d64', letterSpacing: -0.5 }}>Trash</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>{trashed.length} deleted article{trashed.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading...</div>
      ) : trashed.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 20, border: '2px dashed #e2e8f0', padding: '5rem 2rem', textAlign: 'center' }}>
          <FiTrash2 size={40} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#94a3b8', fontWeight: 500 }}>Trash is empty</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {trashed.map((blog, i) => (
            <motion.div key={blog.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #fee2e2', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', opacity: 0.9 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#f8fafc', filter: 'grayscale(0.4)' }}>
                {blog.image_url ? <img src={blog.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiFileText size={22} color="#cbd5e1" /></div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 700, color: '#64748b', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{blog.category} · Deleted</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => handleRestore(blog.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#f0fdf4', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, color: '#0e9f6e', cursor: 'pointer' }}>
                  <FiRefreshCw size={13} /> Restore
                </button>
                <button onClick={() => handleDelete(blog.id, blog.title)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#fef2f2', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, color: '#ef4444', cursor: 'pointer' }}>
                  <FiTrash2 size={13} /> Delete Forever
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;
