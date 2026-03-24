import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiUploadCloud, FiImage, FiX, FiAlertCircle, FiCheck, FiSearch } from 'react-icons/fi';
import { adminGetBlogs, adminCreateBlog, adminUpdateBlog, uploadImage, getMedia } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';

const CATEGORIES = [
  'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics',
  'Orthopaedics', 'Emergency Care', 'Dermatology', 'Ophthalmology'
];

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'library'
  const [libraryItems, setLibraryItems] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fileRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'library') {
      fetchLibrary();
    }
  }, [activeTab]);

  const fetchLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const res = await getMedia('image');
      setLibraryItems(res.data || []);
    } catch (err) {
      console.error('Failed to fetch library', err);
    } finally {
      setLoadingLibrary(false);
    }
  };

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'General Medicine',
    status: 'draft', author: 'Dr. Medical Team', image_url: '', slug: '',
    seo_title: '', seo_description: '', seo_score: 0, tags: ''
  });

  useEffect(() => {
    const score = calculateSeoScore();
    setForm(prev => ({ ...prev, seo_score: score }));
  }, [form.title, form.content, form.seo_title, form.seo_description]);

  const calculateSeoScore = () => {
    let score = 0;
    if (form.title.length > 20) score += 10;
    if (form.content.length > 300) score += 20;
    if (form.seo_title.length >= 50 && form.seo_title.length <= 60) score += 20;
    else if (form.seo_title.length > 0) score += 10;
    if (form.seo_description.length >= 120 && form.seo_description.length <= 160) score += 20;
    else if (form.seo_description.length > 0) score += 10;
    if (form.image_url) score += 10;
    if (form.excerpt.length > 50) score += 10;
    if (form.slug.length > 5) score += 10;
    if (form.tags.length > 0) score += 5;
    return Math.min(score, 100);
  };
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const uploadContext = useRef('featured'); // 'featured' or 'content'

  useEffect(() => {
    if (isEditing) {
      adminGetBlogs().then(res => {
        const blog = res.data.find(b => String(b.id) === String(id));
        if (blog) setForm({ 
          title: blog.title || '', 
          excerpt: blog.excerpt || '', 
          content: blog.content || '', 
          category: blog.category || 'General Medicine', 
          status: blog.status || 'draft', 
          author: blog.author || 'Dr. Medical Team', 
          image_url: blog.image_url || '',
          slug: blog.slug || '',
          seo_title: blog.seo_title || '',
          seo_description: blog.seo_description || '',
          seo_score: blog.seo_score || 0,
          tags: blog.tags || ''
        });
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title
    if (name === 'title' && !isEditing) {
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, title: value, slug: generatedSlug }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRichTextImageUpload = async (file) => {
    try {
      setUploading(true);
      const res = await uploadImage(file);
      setUploading(false);
      return res.data.url;
    } catch (err) {
      console.error(err);
      setError('Failed to upload image to editor.');
      setUploading(false);
      return null;
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    const currentContext = uploadContext.current; // Capture context at start of upload
    try {
      const res = await uploadImage(file);
      
      if (currentContext === 'content') {
        // This path is now handled by handleRichTextImageUpload
        // This block might be removed if no other 'content' context upload exists
      } else {
        setForm(prev => ({ ...prev, image_url: res.data.url }));
      }
    } catch (err) {
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      uploadContext.current = 'featured'; // Reset
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e, forcedStatus = null) => {
    if (e) e.preventDefault();
    
    // Basic validation
    if (!form.title || !form.content) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError('');

    const finalStatus = forcedStatus || form.status;
    const payload = { ...form, status: finalStatus };

    try {
      if (isEditing) {
        await adminUpdateBlog(id, payload);
      } else {
        await adminCreateBlog(payload);
      }
      navigate('/blogs');
    } catch (err) {
      console.error('Save error:', err.response?.data);
      const errorDetail = err.response?.data?.detail;
      setError(typeof errorDetail === 'string' ? errorDetail : 'Failed to save blog. Please try again.');
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', sticky: 'top', top: 0, background: '#f8fafc', zIndex: 10, padding: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/blogs" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            <FiArrowLeft size={16} /> Back
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0e3d64', letterSpacing: -0.5 }}>
            {isEditing ? 'Edit Blog' : 'New Blog'}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="button" onClick={() => handleSubmit(null, 'draft')} disabled={saving || uploading}
            style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 14, fontWeight: 700, fontSize: 13, cursor: (saving || uploading) ? 'not-allowed' : 'pointer' }}>
            Save Draft
          </button>
          <button type="button" onClick={() => handleSubmit(null, 'published')} disabled={saving || uploading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: saving ? '#94a3b8' : '#0e9f6e', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: (saving || uploading) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(14,159,110,0.3)' }}>
            <FiCheck size={16} /> {isEditing ? (form.status === 'published' ? 'Update Post' : 'Publish Now') : 'Publish Article'}
          </button>
        </div>
      </motion.div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontSize: 14, marginBottom: '1.5rem' }}>
          <FiAlertCircle size={16} /> {error}
        </div>
      )}

      <form id="blog-form" onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Main Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Title & Slug */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Blog Title *</label>
              <input name="title" type="text" required value={form.title} onChange={handleChange} placeholder="Enter a compelling title..."
                style={{ ...inputStyle, fontSize: 18, fontWeight: 700, border: 'none', padding: 0, background: 'transparent' }} />
              
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Slug:</span>
                <input name="slug" type="text" value={form.slug} onChange={handleChange} placeholder="url-slug-here"
                  style={{ ...inputStyle, fontSize: 12, padding: '0.3rem 0.6rem', border: '1px dashed #cbd5e1', background: '#fff', width: 'auto' }} />
              </div>
            </div>

            {/* Short Summary */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9' }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Short Summary *</label>
              <textarea name="excerpt" required rows={3} value={form.excerpt} onChange={handleChange} placeholder="Write a brief summary..."
                style={{ ...inputStyle, minHeight: 80, resize: 'none' }} />
            </div>

            {/* Content Editor */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9', position: 'relative' }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Article Content *</label>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <RichTextEditor
                  content={form.content}
                  onChange={(val) => setForm(prev => ({ ...prev, content: val }))}
                  onImageUpload={handleRichTextImageUpload}
                  height="500px"
                />
              </div>
            </div>

            {/* SEO Settings */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0e3d64', margin: 0 }}>SEO Settings</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: form.seo_score > 70 ? '#f0fdf4' : '#fff7ed', padding: '0.3rem 0.75rem', borderRadius: 10, border: '1px solid', borderColor: form.seo_score > 70 ? '#bbf7d0' : '#ffedd5' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: form.seo_score > 70 ? '#166534' : '#9a3412' }}>Score: {form.seo_score}%</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>SEO Title</label>
                    <span style={{ fontSize: 10, color: (form.seo_title.length > 60 || form.seo_title.length < 50) ? '#ef4444' : '#0e9f6e' }}>{form.seo_title.length}/60</span>
                  </div>
                  <input name="seo_title" type="text" value={form.seo_title} onChange={handleChange} placeholder="Keywords-rich title..." style={inputStyle} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Meta Description</label>
                    <span style={{ fontSize: 10, color: (form.seo_description.length > 160 || form.seo_description.length < 120) ? '#ef4444' : '#0e9f6e' }}>{form.seo_description.length}/160</span>
                  </div>
                  <textarea name="seo_description" rows={3} value={form.seo_description} onChange={handleChange} placeholder="Engaging description for search results..." style={{ ...inputStyle, resize: 'none' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Publish Settings */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#0e3d64', marginBottom: '1rem' }}>Publish Settings</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'none' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: '0.4rem' }}>Status</label>
                  <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: '0.4rem' }}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: '0.4rem' }}>Author</label>
                  <input name="author" type="text" value={form.author} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: '0.4rem' }}>Tags</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    {form.tags.split(',').filter(t => t.trim()).map((tag, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f1f5f9', color: '#475569', fontSize: 10, fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        {tag.trim()}
                        <FiX size={10} style={{ cursor: 'pointer' }} onClick={() => {
                          const newTags = form.tags.split(',').filter((_, index) => index !== i).join(',');
                          setForm(p => ({ ...p, tags: newTags }));
                        }} />
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    placeholder="Press Enter to add tag..." 
                    style={{ ...inputStyle, fontSize: 12, padding: '0.5rem 0.75rem' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.target.value.trim();
                        if (val) {
                          const currentTags = form.tags ? form.tags.split(',').map(t => t.trim()) : [];
                          if (!currentTags.includes(val)) {
                            const newTags = [...currentTags, val].join(',');
                            setForm(p => ({ ...p, tags: newTags }));
                          }
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#0e3d64' }}>Featured Image</p>
                {!form.image_url && (
                  <div style={{ display: 'flex', background: '#f1f5f9', padding: 3, borderRadius: 10 }}>
                    <button type="button" onClick={() => setActiveTab('upload')} style={{ padding: '0.3rem 0.6rem', border: 'none', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: activeTab === 'upload' ? '#fff' : 'transparent', color: activeTab === 'upload' ? '#0e9f6e' : '#64748b', boxShadow: activeTab === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Upload</button>
                    <button type="button" onClick={() => setActiveTab('library')} style={{ padding: '0.3rem 0.6rem', border: 'none', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: activeTab === 'library' ? '#fff' : 'transparent', color: activeTab === 'library' ? '#0e9f6e' : '#64748b', boxShadow: activeTab === 'library' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Library</button>
                  </div>
                )}
              </div>

              {form.image_url ? (
                <div style={{ position: 'relative' }}>
                  <img src={form.image_url} alt="Featured" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12 }} />
                  <button type="button" onClick={() => setForm(p => ({ ...p, image_url: '' }))} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 8, padding: '0.3rem', color: '#fff', cursor: 'pointer' }}><FiX size={14} /></button>
                </div>
              ) : activeTab === 'upload' ? (
                <div onClick={() => document.getElementById('featured-upload').click()} style={{ border: '2px dashed #e2e8f0', borderRadius: 14, padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
                  <FiUploadCloud size={24} color="#94a3b8" />
                  <p style={{ color: '#64748b', fontSize: 11, fontWeight: 600, marginTop: 8 }}>Click to upload</p>
                  <input id="featured-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const res = await uploadImage(file);
                      setForm(prev => ({ ...prev, image_url: res.data.url }));
                      setActiveTab('upload');
                    } catch (err) {
                      setError('Failed to upload featured image.');
                    } finally {
                      setUploading(false);
                    }
                  }} />
                </div>
              ) : (
                <div style={{ height: 180, overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: 12 }}>
                  {loadingLibrary ? (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '2rem', fontSize: 11, color: '#94a3b8' }}>Loading...</div>
                  ) : libraryItems.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setForm(prev => ({ ...prev, image_url: item.url }))}
                      style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', border: '2px solid transparent' }}
                      onMouseEnter={e => e.currentTarget.style.border = '2px solid #0e9f6e'}
                      onMouseLeave={e => e.currentTarget.style.border = '2px solid transparent'}
                    >
                      <img src={item.url} alt="library" style={{ width: '100%', height: 80, objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
