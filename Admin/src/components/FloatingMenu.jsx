import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBold, FiItalic, FiLink, FiType, FiHash } from 'react-icons/fi';

const FloatingMenu = ({ position, onFormat, visible }) => {
  const menuRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [url, setUrl] = useState('');

  // Reset state when visibility changes
  useEffect(() => {
    if (!visible) {
      setShowLinkInput(false);
      setUrl('');
    }
  }, [visible]);

  const handleAction = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'link') {
      setShowLinkInput(true);
      return;
    }
    
    onFormat(type);
  };

  const submitLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (url.trim()) {
      onFormat('link_url', url.trim());
    }
    setShowLinkInput(false);
    setUrl('');
  };

  const handleLinkKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitLink(e);
    } else if (e.key === 'Escape') {
      setShowLinkInput(false);
      setUrl('');
      onFormat('focus'); // Optional target to just return focus
    }
  };

  const items = [
    { id: 'bold', icon: <FiBold size={15} />, tooltip: 'Bold' },
    { id: 'italic', icon: <FiItalic size={15} />, tooltip: 'Italic' },
    { id: 'link', icon: <FiLink size={15} />, tooltip: 'Link' },
    { id: 'h2', icon: <FiHash size={15} />, tooltip: 'Heading 2' },
    { id: 'h3', icon: <FiType size={15} />, tooltip: 'Heading 3' },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="floating-menu"
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            zIndex: 1000,
            background: '#1f2937', // Dark theme for a premium feel
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)',
            padding: showLinkInput ? '0.4rem 0.6rem' : '0.3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            transform: 'translateX(-50%)' // Center exactly above selection
          }}
          onMouseDown={(e) => {
            // Prevent click inside floating menu from stealing focus and deselecting text
            if (e.target.tagName !== 'INPUT') {
              e.preventDefault();
            }
          }}
        >
          {showLinkInput ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input
                autoFocus
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleLinkKeyDown}
                placeholder="https://..."
                style={{
                  background: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: 6,
                  color: '#fff',
                  padding: '0.3rem 0.6rem',
                  fontSize: 13,
                  outline: 'none',
                  width: 180
                }}
              />
              <button
                type="button"
                onClick={submitLink}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '0.3rem 0.8rem',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                title={item.tooltip}
                type="button"
                onClick={(e) => handleAction(item.id, e)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  border: 'none',
                  background: 'transparent',
                  color: '#d1d5db',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.1s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#374151';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#d1d5db';
                }}
              >
                {item.icon}
              </button>
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingMenu;
