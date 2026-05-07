import React, { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiTrash2, FiEdit2, FiMapPin, FiImage, FiUploadCloud, FiX, FiSearch } from 'react-icons/fi';
import { uploadImage, getMedia } from '../services/api';
import { config } from '../config';

const API_URL = config.API_URL;

const CATEGORIES = ["ALL", "HEALTH CAMP", "SEMINAR", "AWARENESS", "BLOOD DONATION"];
const STATUSES = ["upcoming", "completed"];

const EventsAdmin = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'library'
    const [libraryItems, setLibraryItems] = useState([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'ALL',
        status: 'upcoming',
        image_url: '',
        map_url: '',
        hours: '',
        address: '',
        host_name: '',
        contact_number: '',
        slug: '',
        sort_date: ''
    });

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/api/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (isFormOpen && activeTab === 'library') {
            fetchLibrary();
        }
    }, [isFormOpen, activeTab]);

    const handleImageUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const res = await uploadImage(file);
            setFormData(prev => ({ ...prev, image_url: res.data.url }));
        } catch (err) {
            console.error(err);
            alert('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-generate slug from title (only if not editing an existing slug manually)
        if (name === 'title' && !editingEvent) {
            const generatedSlug = value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, title: value, slug: generatedSlug }));
            return;
        }

        if (name === 'sort_date') {
            const dateObj = new Date(value);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options).toUpperCase();
            setFormData(prev => ({ ...prev, sort_date: value, date: formattedDate }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenForm = (event = null) => {
        setActiveTab('upload');
        if (event) {
            setEditingEvent(event);
            // Ensure all fields have at least an empty string to keep inputs "controlled"
            setFormData({
                title: event.title || '',
                description: event.description || '',
                date: event.date || '',
                location: event.location || '',
                category: event.category || 'ALL',
                status: event.status || 'upcoming',
                image_url: event.image_url || '',
                map_url: event.map_url || '',
                hours: event.hours || '',
                address: event.address || '',
                host_name: event.host_name || '',
                contact_number: event.contact_number || '',
                slug: event.slug || '',
                sort_date: event.sort_date || ''
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: '', description: '', date: '', location: '',
                category: 'ALL', status: 'upcoming', image_url: '',
                map_url: '', hours: '', address: '', host_name: '', contact_number: '',
                slug: '', sort_date: ''
            });
        }
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        const url = editingEvent 
            ? `${API_URL}/api/admin/events/${editingEvent.id}` 
            : `${API_URL}/api/admin/events`;
        const method = editingEvent ? 'PUT' : 'POST';

        // Construct a clean payload matching the Backend's EventBase/Update schemas
        const payload = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            location: formData.location || null,
            category: formData.category || 'ALL',
            status: formData.status || 'upcoming',
            image_url: formData.image_url || null,
            map_url: formData.map_url || null,
            hours: formData.hours || null,
            address: formData.address || null,
            host_name: formData.host_name || null,
            contact_number: formData.contact_number || null,
            slug: formData.slug || null,
        };

        // Only add sort_date if it's a valid date string
        if (formData.sort_date) {
            payload.sort_date = formData.sort_date;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsFormOpen(false);
                fetchEvents();
            } else {
                alert("Failed to save event");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event permanently?")) return;
        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_URL}/api/admin/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchEvents();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: 0 }}>Events Hub</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Manage all frontend website events.</p>
                </div>
                <button 
                    onClick={() => handleOpenForm()}
                    style={{
                        padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: '#10b981', color: 'white', border: 'none', borderRadius: '8px',
                        cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
                    }}
                >
                    <FiPlus /> Add New Event
                </button>
            </div>

            {isFormOpen && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                        {editingEvent ? 'Edit Event' : 'Create Event'}
                    </h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', background: '#fff', padding: '1.5rem', borderRadius: '16px' }}>
                        {/* Section 1: Basic Info */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                <FiEdit2 size={14} className="text-primary" /> Title
                            </label>
                            <input required name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Annual Health Camp" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none' }} className="focus:border-primary focus:ring-4 focus:ring-primary/10" />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                URL Slug (Auto-generated)
                            </label>
                            <input required name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. annual-health-camp" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', background: '#f9fafb' }} />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                Description
                            </label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Tell people about this event..." style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', resize: 'none' }} />
                        </div>

                        {/* Section 2: Date & Time */}
                        <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                    <FiCalendar size={14} className="text-primary" /> Event Date
                                </label>
                                <input required type="date" name="sort_date" value={formData.sort_date} onChange={handleChange} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem' }} />
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>Event will automatically move to 'Completed' after this date.</p>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Event Hours</label>
                                <input name="hours" value={formData.hours} onChange={handleChange} placeholder="e.g. 10:00 AM - 5:00 PM" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', background: '#fff' }}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Section 3: Details */}
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                <FiMapPin size={14} className="text-primary" /> Location
                            </label>
                            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Erode" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>System Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', background: '#fff' }}>
                                {STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Host Name</label>
                            <input name="host_name" value={formData.host_name} onChange={handleChange} placeholder="e.g. Sri Ponni Medical Team" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Contact Number</label>
                            <input name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="+91 98765 43210" style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem' }} />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Google Maps Embed URL</label>
                            <input name="map_url" value={formData.map_url} onChange={handleChange} placeholder="https://www.google.com/maps/embed?..." style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem' }} />
                            <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>Go to Google Maps &gt; Share &gt; Embed &gt; Copy 'src' URL.</p>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Full Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="Complete address for the clinic/venue..." style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', resize: 'none' }} />
                        </div>

                        {/* Featured Image Section */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '1.5rem', background: '#f8fafc', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase' }}>Featured Image</label>
                                {!formData.image_url && (
                                    <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '10px' }}>
                                        <button type="button" onClick={() => setActiveTab('upload')} style={{ padding: '0.25rem 0.5rem', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: activeTab === 'upload' ? '#fff' : 'transparent', color: activeTab === 'upload' ? '#10b981' : '#64748b', boxShadow: activeTab === 'upload' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Upload</button>
                                        <button type="button" onClick={() => setActiveTab('library')} style={{ padding: '0.25rem 0.5rem', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: activeTab === 'library' ? '#fff' : 'transparent', color: activeTab === 'library' ? '#10b981' : '#64748b', boxShadow: activeTab === 'library' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>Library</button>
                                    </div>
                                )}
                            </div>

                            {formData.image_url ? (
                                <div style={{ position: 'relative', width: 'fit-content' }}>
                                    <img src={formData.image_url} alt="Event" style={{ height: '140px', borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                                    <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                        <FiX size={14} />
                                    </button>
                                </div>
                            ) : activeTab === 'upload' ? (
                                <div onClick={() => document.getElementById('event-image-upload').click()} style={{ border: '2px dashed #d1d5db', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: uploading ? '#f3f4f6' : 'white' }}>
                                    <FiUploadCloud size={32} style={{ color: '#9ca3af', marginBottom: '0.5rem' }} />
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{uploading ? 'Uploading...' : 'Click to select or drag image here'}</p>
                                    <input id="event-image-upload" type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) handleImageUpload(file);
                                    }} />
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input 
                                            type="text" 
                                            placeholder="Search gallery..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ width: '100%', padding: '0.4rem 0.6rem 0.4rem 2rem', fontSize: 11, borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none' }} 
                                        />
                                    </div>
                                    <div style={{ height: 320, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                        {loadingLibrary ? (
                                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', fontSize: 11, color: '#94a3b8' }}>Loading library...</div>
                                        ) : (libraryItems.filter(item => item.url.toLowerCase().includes(searchQuery.toLowerCase())).length === 0) ? (
                                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', fontSize: 11, color: '#94a3b8' }}>No images found</div>
                                        ) : libraryItems.filter(item => item.url.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                                            <div 
                                                key={item.id} 
                                                onClick={() => setFormData({ ...formData, image_url: item.url })}
                                                style={{ cursor: 'pointer', borderRadius: 10, overflow: 'hidden', border: '2px solid transparent', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 100, transition: 'all 0.2s' }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = '#10b981';
                                                    e.currentTarget.style.transform = 'scale(1.02)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = 'transparent';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }}
                                            >
                                                <img src={item.url} alt="library" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '0.75rem 1.5rem', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save Event</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div>Loading events...</div>
            ) : events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#f9fafb', borderRadius: '12px' }}>No events added yet.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {events.map(event => (
                        <div key={event.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '140px', background: '#f3f4f6', position: 'relative' }}>
                                {event.image_url ? (
                                    <img src={event.image_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><FiImage size={32} /></div>
                                )}
                                <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '99px', fontWeight: 'bold' }}>
                                    {event.category}
                                </div>
                                <div style={{ position: 'absolute', top: '8px', right: '8px', background: event.status === 'upcoming' ? '#10b981' : '#6b7280', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '99px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {event.status}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontWeight: 700, margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#111827' }}>{event.title}</h3>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <FiCalendar /> {event.date}
                                </div>
                                {event.location && (
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                        <FiMapPin /> {event.location}
                                    </div>
                                )}
                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                                    <button onClick={() => handleOpenForm(event)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}><FiEdit2 /> Edit</button>
                                    <button onClick={() => handleDelete(event.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}><FiTrash2 /> Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsAdmin;
