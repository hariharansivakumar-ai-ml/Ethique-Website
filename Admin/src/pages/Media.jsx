import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiTrash2, FiCopy, FiCheck, FiImage, FiVideo, FiX, FiSave } from 'react-icons/fi';
import { getMedia, deleteMedia, uploadImage } from '../services/api';

const Media = () => {
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'upload'
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
    if (activeTab === 'library') {
      fetchMedia();
    }
  }, [activeTab, activeType]);

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
      await uploadImage(previewFile, activeTab === 'upload' ? (activeType || 'image') : activeType);
      handleCancelPreview();
      setActiveTab('library'); // Switch back after successful upload
      await fetchMedia(); // Refresh list
    } catch (err) {
      console.error('Upload Error full response:', err.response);
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

  const tabStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: 12,
    background: isActive ? '#0e9f6e' : 'transparent',
    color: isActive ? '#fff' : '#64748b',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0e3d64', letterSpacing: -0.5, marginBottom: '0.5rem' }}>
          Media Hub
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Manage your digital assets and upload new media for your blog.</p>
      </div>

      {/* Main Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        background: '#fff', 
        padding: '0.5rem', 
        borderRadius: 16, 
        border: '1px solid #f1f5f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        marginBottom: '2rem',
        width: 'fit-content'
      }}>
        <button onClick={() => setActiveTab('library')} style={tabStyle(activeTab === 'library')}>
          <FiImage size={18} /> Media Library
        </button>
        <button onClick={() => setActiveTab('upload')} style={tabStyle(activeTab === 'upload')}>
          <FiUploadCloud size={18} /> Upload New
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'upload' ? (
          <motion.div
            key="upload-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div style={{ background: '#fff', borderRadius: 24, padding: '2.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0e3d64', marginBottom: '1.5rem', textAlign: 'center' }}>
                  Upload New Asset
                </h2>
                
                {/* Media Type Selection for Upload */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  {['image', 'video'].map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      style={{
                        padding: '0.5rem 1.5rem', borderRadius: 10, border: '2px solid',
                        borderColor: activeType === type ? '#0e9f6e' : '#f1f5f9',
                        background: activeType === type ? '#f0fdf4' : '#fff',
                        color: activeType === type ? '#0e9f6e' : '#64748b',
                        fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {!previewFile ? (
                  <div 
                    onClick={() => fileRef.current?.click()}
                    style={{
                      background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: 20,
                      padding: '4rem 2rem', textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0e9f6e'; e.currentTarget.style.background = '#f0fdf4'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <FiUploadCloud size={30} color="#0e9f6e" />
                    </div>
                    <div>
                      <p style={{ color: '#1e293b', fontWeight: 800, fontSize: 16 }}>Click to browse or drag & drop</p>
                      <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                        {activeType === 'image' ? 'JPEG, PNG, WebP up to 5MB' : 'MP4, WebM up to 50MB'}
                      </p>
                    </div>
                    <input ref={fileRef} type="file" accept={activeType === 'image' ? 'image/*' : 'video/*'} style={{ display: 'none' }} onChange={handleFileSelect} />
                  </div>
                ) : (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 20, padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', background: '#fff' }}>
                    <div style={{ width: 140, height: 140, borderRadius: 16, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                      {activeType === 'image' ? (
                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <video src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop autoPlay />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: '#0e9f6e', textTransform: 'uppercase', marginBottom: 4 }}>Ready for upload</p>
                      <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: 16, fontWeight: 700 }}>{previewFile.name}</h3>
                      <p style={{ margin: '0 0 1.25rem 0', color: '#64748b', fontSize: 13 }}>{(previewFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={handleCancelPreview} disabled={uploading} style={{ padding: '0.65rem 1.25rem', background: '#f1f5f9', border: 'none', borderRadius: 10, color: '#475569', fontWeight: 700, fontSize: 13, cursor: uploading ? 'not-allowed' : 'pointer' }}>
                          Cancel
                        </button>
                        <button onClick={handleUpload} disabled={uploading} style={{ padding: '0.65rem 1.5rem', background: '#0e9f6e', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: uploading ? 'not-allowed' : 'pointer' }}>
                          {uploading ? 'Processing...' : 'Upload Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="library-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Library Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', background: '#fff', padding: 4, borderRadius: 12, border: '1px solid #f1f5f9' }}>
                {['image', 'video'].map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1.25rem', border: 'none', borderRadius: 10,
                      background: activeType === type ? '#f1f5f9' : 'transparent',
                      color: activeType === type ? '#0e3d64' : '#94a3b8',
                      fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize'
                    }}
                  >
                    {type === 'image' ? <FiImage size={16} /> : <FiVideo size={16} />} {type}s
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Showing {mediaItems.length} {activeType}s</p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9' }}>
                <div style={{ width: 40, height: 40, border: '3px solid #f1f5f9', borderTopColor: '#0e9f6e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : mediaItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9' }}>
                <p style={{ color: '#64748b', fontWeight: 600 }}>No {activeType}s found in the library.</p>
                <button onClick={() => setActiveTab('upload')} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#0e9f6e', fontWeight: 700, cursor: 'pointer' }}>
                  Upload your first one →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {mediaItems.map(item => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: '#fff', borderRadius: 20, overflow: 'hidden',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
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
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                        opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'flex-end', padding: '1rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <p style={{ color: '#fff', fontSize: 10, wordBreak: 'break-all', margin: 0, fontWeight: 500 }}>{item.public_id}</p>
                      </div>
                    </div>
                    
                    <div style={{ padding: '1rem', display: 'flex', gap: '0.6rem' }}>
                      <button
                        onClick={() => handleCopy(item.url, item.id)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                          padding: '0.6rem', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10,
                          color: '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {copiedId === item.id ? <><FiCheck color="#10b981" size={14} /> Copied</> : <><FiCopy size={14} /> Copy URL</>}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0.6rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 10,
                          color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        title="Delete permanently"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Media;
