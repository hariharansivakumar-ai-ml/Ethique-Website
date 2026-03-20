import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiUploadCloud, FiImage, FiX, FiAlertCircle } from 'react-icons/fi';
import { adminGetBlogs, adminCreateBlog, adminUpdateBlog, uploadImage } from '../services/api';
import SlashMenu from '../components/SlashMenu';
import FloatingMenu from '../components/FloatingMenu';

const CATEGORIES = [
  'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics',
  'Orthopaedics', 'Emergency Care', 'Dermatology', 'Ophthalmology'
];

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'General Medicine',
    status: 'draft', author: 'Dr. Medical Team', image_url: '', slug: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [slashMenu, setSlashMenu] = useState({ visible: false, top: 0, left: 0, cursorPosition: 0 });
  const [floatingMenu, setFloatingMenu] = useState({ visible: false, top: 0, left: 0, start: 0, end: 0 });
  const contentRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      adminGetBlogs().then(res => {
        const blog = res.data.find(b => b.id === id);
        if (blog) setForm({ 
          title: blog.title || '', 
          excerpt: blog.excerpt || '', 
          content: blog.content || '', 
          category: blog.category || 'General Medicine', 
          status: blog.status || 'draft', 
          author: blog.author || 'Dr. Medical Team', 
          image_url: blog.image_url || '',
          slug: blog.slug || ''
        });
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, selectionStart } = e.target;
    
    // Auto-generate slug from title
    if (name === 'title' && !isEditing) {
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, title: value, slug: generatedSlug }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'content') {
      const char = value[selectionStart - 1];
      if (char === '/') {
        // Simple caret position estimation
        const { offsetTop, offsetLeft } = e.target;
        const rect = e.target.getBoundingClientRect();
        
        // Approximate position (for a more accurate one, we'd need a mirror div)
        // But for now, let's place it near the textarea's current focus area
        setSlashMenu({
          visible: true,
          top: rect.top + 20, // Simplified
          left: rect.left + 20, // Simplified
          cursorPosition: selectionStart
        });
      } else {
        if (slashMenu.visible) setSlashMenu(prev => ({ ...prev, visible: false }));
      }
    }
  };

  const handleSlashSelect = (item) => {
    const { cursorPosition } = slashMenu;
    const before = form.content.substring(0, cursorPosition - 1);
    const after = form.content.substring(cursorPosition);
    let insertion = '';

    if (item.id === 'h2') insertion = '## ';
    else if (item.id === 'h3') insertion = '### ';
    else if (item.id === 'bullet') insertion = '- ';
    else if (item.id === 'image') {
      fileRef.current?.click();
      setSlashMenu(prev => ({ ...prev, visible: false }));
      return;
    }

    setForm(prev => ({ ...prev, content: before + insertion + after }));
    setSlashMenu(prev => ({ ...prev, visible: false }));
    
    // Set focus back to textarea
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus();
        const newPos = cursorPosition - 1 + insertion.length;
        contentRef.current.setSelectionRange(newPos, newPos);
      }
    }, 10);
  };

  const handleTextareaSelection = (e) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    
    const { selectionStart, selectionEnd } = textarea;
    if (selectionStart !== selectionEnd) {
      const rect = textarea.getBoundingClientRect();
      
      let top = rect.top + 20;
      let left = rect.left + rect.width / 2;
      
      if (e.type === 'mouseup') {
        top = e.clientY - 50; // 50px above mouse
        left = e.clientX;
      } else if (e.type === 'keyup') {
        top = rect.top + 40; // Default fallback for keyboard selection
        left = rect.left + rect.width / 2;
      }
      
      setFloatingMenu({
        visible: true,
        top,
        left,
        start: selectionStart,
        end: selectionEnd
      });
    } else {
      if (floatingMenu.visible) setFloatingMenu(prev => ({ ...prev, visible: false }));
    }
  };

  const applyFormatting = (type, value = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    
    const { selectionStart, selectionEnd } = textarea;
    if (selectionStart === selectionEnd) return;
    
    const start = selectionStart;
    const end = selectionEnd;
    
    const text = form.content;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    
    let formatted = selected;
    let newCursorPos = end;
    
    switch (type) {
      case 'bold':
        formatted = `**${selected}**`;
        newCursorPos = start + formatted.length;
        break;
      case 'italic':
        formatted = `*${selected}*`;
        newCursorPos = start + formatted.length;
        break;
      case 'link_url':
        formatted = `[${selected}](${value})`;
        newCursorPos = start + formatted.length;
        break;
      case 'h2':
        formatted = `## ${selected}`;
        newCursorPos = start + formatted.length;
        break;
      case 'h3':
        formatted = `### ${selected}`;
        newCursorPos = start + formatted.length;
        break;
      case 'focus':
        // Just refocusing after escape
        break;
      default:
        break;
    }
    
    setForm(prev => ({ ...prev, content: before + formatted + after }));
    setFloatingMenu(prev => ({ ...prev, visible: false }));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadImage(file);
      setForm(prev => ({ ...prev, image_url: res.data.url }));
    } catch (err) {
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await adminUpdateBlog(id, form);
      } else {
        await adminCreateBlog(form);
      }
      navigate('/blogs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save blog. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.875rem 1rem', background: '#f8fafc',
    border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, color: '#374151',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/blogs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#0e9f6e'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
            <FiArrowLeft size={16} /> Back
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0e3d64', letterSpacing: -0.5 }}>
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
        </div>
        <button type="submit" form="blog-form" disabled={saving || uploading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: saving ? 'rgba(14,159,110,0.5)' : 'linear-gradient(135deg,#0e9f6e,#057a55)', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(14,159,110,0.35)' }}>
          <FiSave size={16} /> {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Publish')}
        </button>
      </motion.div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontSize: 14, marginBottom: '1.5rem' }}>
          <FiAlertCircle size={16} /> {error}
        </div>
      )}

      <form id="blog-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Title */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Blog Title *</label>
              <input name="title" type="text" required value={form.title} onChange={handleChange} placeholder="Enter a compelling title..."
                style={{ ...inputStyle, fontSize: 18, fontWeight: 700, background: 'transparent', border: 'none', padding: '0', outline: 'none', width: '100%' }} />
              
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Slug:</span>
                <input name="slug" type="text" value={form.slug} onChange={handleChange} placeholder="url-slug-here"
                  style={{ ...inputStyle, fontSize: 12, padding: '0.4rem 0.6rem', background: '#fff', border: '1px dashed #cbd5e1' }} />
              </div>
            </div>

            {/* Excerpt */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Short Summary *</label>
              <textarea name="excerpt" required rows={3} value={form.excerpt} onChange={handleChange} placeholder="Write a brief summary for the preview card..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} />
            </div>

            {/* Content */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Full Article Content *</label>
              <textarea 
                ref={contentRef}
                name="content" 
                required 
                rows={14} 
                value={form.content} 
                onChange={handleChange} 
                onMouseUp={handleTextareaSelection}
                onKeyUp={handleTextareaSelection}
                placeholder="Type / for commands (Headers, Images...)"
                style={{ ...inputStyle, resize: 'vertical', minHeight: 360, lineHeight: 1.7 }} 
              />
              {slashMenu.visible && (
                <SlashMenu 
                  position={{ top: slashMenu.top, left: slashMenu.left }} 
                  onSelect={handleSlashSelect} 
                  onClose={() => setSlashMenu(prev => ({ ...prev, visible: false }))} 
                />
              )}
              {floatingMenu.visible && (
                <FloatingMenu 
                  position={{ top: floatingMenu.top, left: floatingMenu.left }}
                  onFormat={applyFormatting}
                  visible={floatingMenu.visible}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Publish settings */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0e3d64', marginBottom: '1rem' }}>Publish Settings</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Author</label>
                  <input name="author" type="text" value={form.author} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0e3d64', marginBottom: '1rem' }}>Featured Image</p>
              {form.image_url ? (
                <div style={{ position: 'relative' }}>
                  <img src={form.image_url} alt="Preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12 }} />
                  <button type="button" onClick={() => setForm(p => ({ ...p, image_url: '' }))}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 8, padding: '0.3rem', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                    <FiX size={16} />
                  </button>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                    <a href={form.image_url} target="_blank" rel="noreferrer" style={{ color: '#0e9f6e' }}>View on Cloudinary</a>
                  </p>
                </div>
              ) : (
                <>
                  <div
                    onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
                    onClick={() => fileRef.current?.click()}
                    style={{ border: `2px dashed ${dragOver ? '#0e9f6e' : '#e2e8f0'}`, borderRadius: 14, padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer', background: dragOver ? '#f0fdf4' : '#f8fafc', transition: 'all 0.2s' }}>
                    {uploading ? (
                      <div>
                        <div style={{ width: 36, height: 36, border: '3px solid #0e9f6e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
                        <p style={{ color: '#0e9f6e', fontSize: 13, fontWeight: 600 }}>Uploading to Cloudinary...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      </div>
                    ) : (
                      <>
                        <FiUploadCloud size={32} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
                        <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>Drag & drop or click to upload</p>
                        <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>JPEG, PNG, WebP — max 5MB</p>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(e.target.files[0])} />
                  <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, margin: '0.75rem 0' }}>— or paste URL —</p>
                  <input name="image_url" type="url" value={form.image_url} onChange={handleChange} placeholder="https://..."
                    style={{ ...inputStyle, fontSize: 12 }} />
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
