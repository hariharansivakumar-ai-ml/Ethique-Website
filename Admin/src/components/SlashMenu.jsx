import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiType, FiImage, FiList, FiHash } from 'react-icons/fi';

const SlashMenu = ({ visible, position, onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = [
    { id: 'h2', label: 'Heading 2', icon: <FiHash size={16} />, description: 'Medium section header' },
    { id: 'h3', label: 'Heading 3', icon: <FiType size={16} />, description: 'Small section header' },
    { id: 'image', label: 'Image', icon: <FiImage size={16} />, description: 'Upload from computer' },
    { id: 'bullet', label: 'Bullet List', icon: <FiList size={16} />, description: 'Create a simple bulleted list' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(items[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, items, onSelect, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="slash-menu"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 1000,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          border: '1px solid #f1f5f9',
          padding: '0.5rem',
          width: 240,
          maxHeight: 300,
          overflowY: 'auto'
        }}
      >
        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '0.5rem 0.75rem', letterSpacing: '0.05em' }}>Basic Blocks</p>
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            onMouseEnter={() => setSelectedIndex(index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.75rem',
              borderRadius: 10,
              cursor: 'pointer',
              background: index === selectedIndex ? '#f0fdf4' : 'transparent',
              transition: 'all 0.1s ease'
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: index === selectedIndex ? '#fff' : '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: index === selectedIndex ? '#0e9f6e' : '#64748b',
              boxShadow: index === selectedIndex ? '0 2px 4px rgba(14,159,110,0.1)' : 'none'
            }}>
              {item.icon}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: index === selectedIndex ? '#065f46' : '#374151', margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{item.description}</p>
            </div>
          </div>
        ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlashMenu;
