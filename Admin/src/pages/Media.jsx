import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiTrash2, FiCopy, FiCheck, FiImage, FiVideo, FiX, FiSave } from 'react-icons/fi';
import { getMedia, deleteMedia, uploadImage } from '../services/api';

const Media = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [activeType, setActiveType] = useState('image'); // 'image' or 'video'
  
  // Preview State
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const fileRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, [activeType]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await getMedia(activeType);
      setMediaItems(res.data);
    } catch (err) {
      console.error('Failed to fetch media', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCancelPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!previewFile) return;
    setUploading(true);
    try {
      await uploadImage(previewFile, activeType);
      handleCancelPreview();
      await fetchMedia(); // Refresh list
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this item?')) return;
    
    try {
      await deleteMedia(id);
      setMediaItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Delete failed. Please try again.');
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0e3d64', letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {activeType === 'image' ? <FiImage /> : <FiVideo />} Media Hub
          </h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Manage and upload your blog media</p>
        </div>
        
        {/* Type Selector Tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: 4, borderRadius: 12 }}>
          {['image', 'video'].map(type => (
            <button
              key={type}
              onClick={() => {
                if (activeType !== type) {
                  setActiveType(type);
                  handleCancelPreview();
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', border: 'none', borderRadius: 8,
                background: activeType === type ? '#fff' : 'transparent',
                color: activeType === type ? '#0e3d64' : '#64748b',
                fontWeight: activeType === type ? 600 : 500,
                boxShadow: activeType === type ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize'
              }}
            >
              {type === 'image' ? <FiImage /> : <FiVideo />} {type}s
            </button>
          ))}
        </div>
      </div>

      {/* Uploader / Preview Area */}
      <AnimatePresence mode="wait">
        {!previewFile ? (
          <motion.div 
            key="uploader"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onClick={() => fileRef.current?.click()}
            style={{
              background: '#fff', border: '2px dashed #cbd5e1', borderRadius: 16,
              padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer',
              marginBottom: '2rem', transition: 'all 0.2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0e9f6e'; e.currentTarget.style.background = '#f0fdf4'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#fff'; }}
          >
            <FiUploadCloud size={40} color="#94a3b8" />
            <div>
              <p style={{ color: '#1e293b', fontWeight: 700, fontSize: 15 }}>Click to browse or drag & drop</p>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                {activeType === 'image' ? 'JPEG, PNG, WebP up to 5MB' : 'MP4, WebM up to 50MB'}
              </p>
            </div>
            <input 
              ref={fileRef} type="file" 
              accept={activeType === 'image' ? 'image/*' : 'video/*'} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
              padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem',
              alignItems: 'center', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          >
            <div style={{ width: 160, height: 160, borderRadius: 12, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
              {activeType === 'image' ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: 18 }}>Preview {activeType.charAt(0).toUpperCase() + activeType.slice(1)}</h3>
              <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: 14 }}>
                {previewFile.name} ({(previewFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleCancelPreview}
                  disabled={uploading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.5rem', background: '#f1f5f9', border: 'none', borderRadius: 8,
                    color: '#475569', fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    opacity: uploading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => { if(!uploading) e.currentTarget.style.background = '#e2e8f0'; }}
                  onMouseLeave={(e) => { if(!uploading) e.currentTarget.style.background = '#f1f5f9'; }}
                >
                  <FiX /> Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1.5rem', background: '#0e9f6e', border: 'none', borderRadius: 8,
                    color: '#fff', fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                    opacity: uploading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => { if(!uploading) e.currentTarget.style.background = '#059669'; }}
                  onMouseLeave={(e) => { if(!uploading) e.currentTarget.style.background = '#0e9f6e'; }}
                >
                  {uploading ? (
                    <>
                      <div style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Uploading...
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </>
                  ) : (
                    <><FiSave /> Save</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading media...</p>
      ) : mediaItems.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9' }}>
          No {activeType}s found.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {mediaItems.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: '#fff', borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
                position: 'relative', display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ height: 160, position: 'relative', background: '#f8fafc' }}>
                {activeType === 'image' ? (
                  <img src={item.url} alt="Uploaded media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                )}
                
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'flex-end', padding: '1rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                >
                  <p style={{ color: '#fff', fontSize: 11, wordBreak: 'break-all', margin: 0 }}>{item.public_id}</p>
                </div>
              </div>
              
              <div style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleCopy(item.url, item.id)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                    padding: '0.5rem', background: '#f1f5f9', border: 'none', borderRadius: 8,
                    color: '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                >
                  {copiedId === item.id ? <><FiCheck color="#10b981" /> Copied</> : <><FiCopy /> URL</>}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0.5rem', background: '#fef2f2', border: 'none', borderRadius: 8,
                    color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                  title="Delete from list"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Media;
