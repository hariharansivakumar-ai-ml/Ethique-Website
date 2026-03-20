import { useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import {
  FiGrid, FiFileText, FiPlusCircle, FiClock, FiTrash2,
  FiLogOut, FiHome, FiMenu, FiX, FiBarChart2, FiImage
} from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', icon: FiGrid, path: '/' },
  { label: 'All Blogs', icon: FiFileText, path: '/blogs' },
  { label: 'Add New', icon: FiPlusCircle, path: '/new' },
  { label: 'Media Hub', icon: FiImage, path: '/media' },
  { label: 'Drafts', icon: FiClock, path: '/drafts' },
  { label: 'Trash', icon: FiTrash2, path: '/trash' },
];

const SidebarContent = ({ onNavigate }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div style={{ padding: '2rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #0e9f6e, #057a55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(14,159,110,0.4)'
          }}>
            <FiBarChart2 size={20} color="#fff" />
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>Sri Ponni</p>
            <p style={{ color: '#6ee7b7', fontSize: 11, fontWeight: 500 }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 0.75rem' }}>
        <p style={{
          padding: '0 0.75rem', fontSize: 10, fontWeight: 700,
          color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: '0.75rem'
        }}>Main Menu</p>
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => onNavigate(path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: 12, border: 'none', cursor: 'pointer',
                marginBottom: 4, textAlign: 'left', fontSize: 14, fontWeight: 600,
                background: isActive ? 'linear-gradient(135deg, #0e9f6e, #057a55)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                boxShadow: isActive ? '0 4px 14px rgba(14,159,110,0.3)' : 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; } }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <div style={{ margin: '0.75rem', padding: '1rem', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #0e9f6e, #057a55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: 14
          }}>A</div>
          <div>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>Admin</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>Administrator</p>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.45rem 0.75rem', borderRadius: 10, marginBottom: 6,
            color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600,
            textDecoration: 'none', transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
        >
          <FiHome size={13} /> View Site
        </a>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', padding: '0.5rem', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)',
            background: 'transparent', color: '#f87171', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f87171'; }}
        >
          <FiLogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const [showMobile, setShowMobile] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setShowMobile(false);
  };

  const sidebarStyle = {
    background: '#0f1117',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
  };

  return (
    <>
      {/* Desktop */}
      <aside style={{ ...sidebarStyle, width: 260, flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <SidebarContent onNavigate={handleNavigate} />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setShowMobile(true)}
        style={{
          display: 'none', position: 'fixed', top: 16, left: 16, zIndex: 40,
          padding: '0.6rem', borderRadius: 10, background: '#0f1117',
          border: 'none', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        className="mobile-hamburger"
      >
        <FiMenu size={20} />
      </button>

      {/* Mobile drawer */}
      {showMobile && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowMobile(false)}
          />
          <aside style={{ ...sidebarStyle, position: 'absolute', left: 0, top: 0, bottom: 0, width: 280, boxShadow: '4px 0 30px rgba(0,0,0,0.5)', zIndex: 51 }}>
            <button
              onClick={() => setShowMobile(false)}
              style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '0.4rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            >
              <FiX size={18} />
            </button>
            <SidebarContent onNavigate={handleNavigate} />
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .mobile-hamburger { display: flex !important; } }
      `}</style>
    </>
  );
};

export default AdminSidebar;
