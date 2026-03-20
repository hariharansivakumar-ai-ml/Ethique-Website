import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { login } from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form.username, form.password);
      localStorage.setItem('admin_token', res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f1117 0%, #0e2a1b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
    }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo area */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, #0e9f6e, #057a55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(14,159,110,0.4)'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 26, letterSpacing: -0.5 }}>Sri Ponni Admin</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Sign in to manage your medical blog</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 24, padding: '2.5rem', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fca5a5', fontSize: 13 }}>
                <FiAlertCircle size={15} /> {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} size={16} />
                <input
                  type="text" required autoComplete="username"
                  value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username"
                  style={{
                    width: '100%', paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} size={16} />
                <input
                  type="password" required autoComplete="current-password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  style={{
                    width: '100%', paddingLeft: 42, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '1rem', borderRadius: 14, border: 'none',
                background: loading ? 'rgba(14,159,110,0.5)' : 'linear-gradient(135deg, #0e9f6e, #057a55)',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(14,159,110,0.35)', transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Signing in...' : <><span>Sign In Now</span> <FiArrowRight size={17} /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
