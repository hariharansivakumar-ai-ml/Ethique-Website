import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit2, FiFileText, FiCheck } from 'react-icons/fi';
import { adminGetBlogs, adminUpdateBlog } from '../services/api';

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadDrafts = () => {
    setLoading(true);
    adminGetBlogs()
      .then(res => setDrafts(res.data.filter(b => b.status === 'draft')))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDrafts(); }, []);

  const handlePublish = async (blog) => {
    await adminUpdateBlog(blog.id, { status: 'published' });
    loadDrafts();
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0e3d64', letterSpacing: -0.5 }}>Drafts</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>{drafts.length} unpublished article{drafts.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading...</div>
      ) : drafts.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 20, border: '2px dashed #e2e8f0', padding: '5rem 2rem', textAlign: 'center' }}>
          <FiFileText size={40} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#94a3b8', fontWeight: 500 }}>No drafts — all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {drafts.map((draft, i) => (
            <motion.div key={draft.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#f8fafc' }}>
                {draft.image_url ? <img src={draft.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiFileText size={22} color="#cbd5e1" /></div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 700, color: '#0e3d64', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{draft.category} · {draft.created_at ? new Date(draft.created_at).toLocaleDateString() : '—'}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => navigate(`/edit/${draft.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, color: '#64748b', cursor: 'pointer' }}>
                  <FiEdit2 size={14} /> Edit
                </button>
                <button onClick={() => handlePublish(draft)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#f0fdf4', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, color: '#0e9f6e', cursor: 'pointer' }}>
                  <FiCheck size={14} /> Publish
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;
