import React, { useState, useEffect } from 'react';
import { FiMail, FiClock, FiUser, FiTag, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

import { config } from '../config';

const API_URL = config.API_URL;

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('admin_token');
            // Assuming the endpoint is protected; usually it would require token.
            // If contact.py endpoint was not protected, we just fetch it directly.
            // The plan created the endpoint without Depends(get_current_user), so it's public for now.
            // But we should still pass standard headers.
            const res = await fetch(`${API_URL}/api/contact/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError("Could not load messages. The server might be unavailable.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this message?")) return;
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/api/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete message');
            fetchMessages();
        } catch (err) {
            console.error("Error deleting message:", err);
            alert("Failed to delete message. Please try again.");
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: 0 }}>Contact Messages</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>View inquiries submitted through the frontend website form.</p>
                </div>
                <button 
                    onClick={fetchMessages}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s'
                    }}
                >
                    <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {loading && messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading messages...</div>
            ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#f9fafb', borderRadius: '12px', color: '#6b7280' }}>
                    <FiMail size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '0.5rem' }}>No messages found</h3>
                    <p>There are no contact form submissions yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{
                            background: '#fff', borderRadius: '12px', padding: '1.5rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {msg.subject || 'No Subject'}
                                        {!msg.is_read && <span style={{ padding: '0.1rem 0.5rem', background: '#dbeafe', color: '#1d4ed8', fontSize: '0.7rem', borderRadius: '99px', fontWeight: 600 }}>NEW</span>}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiUser /> {msg.name}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FiMail /> <a href={`mailto:${msg.email}`} style={{ color: '#0e9f6e', textDecoration: 'none' }}>{msg.email}</a></span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <div style={{ color: '#9ca3af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <FiClock /> {formatDate(msg.created_at)}
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(msg.id)}
                                        style={{ 
                                            padding: '0.4rem', color: '#ef4444', background: '#fef2f2', 
                                            border: '1px solid #fee2e2', borderRadius: '6px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Delete Message"
                                        onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fecaca'; }}
                                        onMouseOut={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fee2e2'; }}
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ color: '#4b5563', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
