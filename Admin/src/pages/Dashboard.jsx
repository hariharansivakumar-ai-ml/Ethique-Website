import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText, FiCheckCircle, FiClock, FiPlus, FiEdit2, FiChevronRight
} from 'react-icons/fi';
import { adminGetBlogs } from '../services/api';

const StatCard = ({ label, value, sub, gradient, icon: Icon, barPct, barColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{
      background: gradient, borderRadius: 20, padding: '1.5rem',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
    }}
  >
    <div style={{ position: 'absolute', right: -12, bottom: -12, opacity: 0.12 }}>
      <Icon size={100} color="#fff" />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: 10, backdropFilter: 'blur(4px)' }}>
        <Icon size={18} color="#fff" />
      </div>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
      <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value}</span>
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{sub}</span>
    </div>
    <div style={{ marginTop: '1.25rem', height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 99 }}>
      <div style={{ height: '100%', background: barColor, borderRadius: 99, width: `${Math.max(barPct, value > 0 ? 8 : 0)}%`, transition: 'width 1s ease' }} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetBlogs()
      .then(res => setBlogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeBlogs = blogs.filter(b => !b.is_deleted);
  const total = activeBlogs.length;
  const published = activeBlogs.filter(b => b.status === 'published').length;
  const drafts = activeBlogs.filter(b => b.status === 'draft').length;
  const recent = activeBlogs.slice(0, 6);

  const statCards = [
    {
      label: 'Total Blogs', value: total, sub: 'articles', icon: FiFileText,
      gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
      barColor: '#a78bfa', barPct: 100, delay: 0
    },
    {
      label: 'Published', value: published, sub: 'live', icon: FiCheckCircle,
      gradient: 'linear-gradient(135deg, #0e9f6e, #057a55)',
      barColor: '#6ee7b7', barPct: total > 0 ? Math.round((published / total) * 100) : 0, delay: 0.1
    },
    {
      label: 'Drafts', value: drafts, sub: 'pending', icon: FiClock,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      barColor: '#fde68a', barPct: total > 0 ? Math.round((drafts / total) * 100) : 0, delay: 0.2
    },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: '4px solid #0e9f6e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: 14 }}>Loading Dashboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0e3d64', letterSpacing: -0.5 }}>Dashboard Overview</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Welcome back, Admin! Here's what's happening.</p>
        </div>
        <button
          onClick={() => navigate('/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #0e9f6e, #057a55)', color: '#fff',
            border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 14,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(14,159,110,0.35)'
          }}
        >
          <FiPlus size={18} /> Create Blog
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {statCards.map(card => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Recent Blogs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0e3d64' }}>Recent Blogs</h2>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>Latest updates from your blog</p>
          </div>
          <button
            onClick={() => navigate('/blogs')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', background: '#f0fdf4', color: '#0e9f6e', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            View All <FiChevronRight size={15} />
          </button>
        </div>

        {recent.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {recent.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => navigate(`/edit/${post.id}`)}
                style={{
                  background: '#fff', borderRadius: 18, border: '1px solid #f1f5f9', padding: '1rem',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#f1f5f9' }}>
                    {post.image_url ? (
                      <img src={post.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiFileText size={24} color="#cbd5e1" />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                        background: post.status === 'published' ? '#f0fdf4' : '#fffbeb',
                        color: post.status === 'published' ? '#0e9f6e' : '#d97706'
                      }}>{post.status}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : '—'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0e3d64', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.title || 'Untitled Blog'}
                    </h4>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{post.author || 'Admin'}</span>
                  <button style={{ padding: '0.3rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }}>
                    <FiEdit2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, border: '2px dashed #e2e8f0', padding: '5rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, background: '#f8fafc', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FiFileText size={28} color="#e2e8f0" />
            </div>
            <p style={{ color: '#94a3b8', fontWeight: 500, marginBottom: '1rem' }}>No blog posts yet</p>
            <button
              onClick={() => navigate('/new')}
              style={{ padding: '0.75rem 1.5rem', background: '#0f1117', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Create First Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
