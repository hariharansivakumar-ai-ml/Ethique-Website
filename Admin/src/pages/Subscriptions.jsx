import React, { useState, useEffect } from 'react';
import { FiUsers, FiClock, FiUser, FiMail, FiPhone, FiRefreshCw, FiTrash2, FiUserCheck } from 'react-icons/fi';
import { config } from '../config';

const API_URL = config.API_URL;

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscriptions = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/api/admin/subscriptions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch subscriptions');
            const data = await res.json();
            setSubscriptions(data);
        } catch (err) {
            console.error("Error fetching subscriptions:", err);
            setError("Could not load subscriptions. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const deleteSubscription = async (id) => {
        if (!window.confirm("Are you sure you want to remove this subscriber?")) return;

        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/api/admin/subscriptions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setSubscriptions(subscriptions.filter(sub => sub.id !== id));
            } else {
                alert("Failed to delete subscription.");
            }
        } catch (err) {
            console.error("Error deleting subscription:", err);
            alert("Error deleting subscription.");
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={{ padding: '1rem' }}>
            {/* Header section matches EventsAdmin style */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                        Subscriptions Hub
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        Manage all frontend website subscribers and newsletter alerts.
                    </p>
                </div>
                <button
                    onClick={fetchSubscriptions}
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem',
                        background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '12px',
                        cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                >
                    <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    {loading ? 'Refreshing...' : 'Refresh List'}
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem 1.5rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '2rem', fontWeight: 500, border: '1px solid #fecaca' }}>
                    {error}
                </div>
            )}

            {loading && subscriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: '#9ca3af' }}>
                    <div className="animate-spin mb-4" style={{ display: 'inline-block' }}><FiRefreshCw size={32} /></div>
                    <p style={{ fontSize: '1.1rem' }}>Loading subscribers...</p>
                </div>
            ) : subscriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#fff', borderRadius: '2rem', border: '2px border-dashed #e5e7eb' }}>
                    <div style={{ width: 80, height: 80, background: '#f3f4f6', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <FiUserCheck size={40} color="#9ca3af" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>No subscribers yet</h3>
                    <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>Once users sign up through the website popup, they will appear here automatically.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                    {subscriptions.map(sub => (
                        <div key={sub.id} style={{
                            background: '#fff', borderRadius: '1.5rem', padding: '1.75rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                            className="hover:shadow-xl hover:shadow-gray-200/50"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: '1rem',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: '1.25rem', fontWeight: 800, flexShrink: 0
                                }}>
                                    {sub.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>
                                        {sub.name}
                                    </h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FiMail color="#10b981" />
                                            <a href={`mailto:${sub.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{sub.email}</a>
                                        </span>
                                        {sub.phone && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FiPhone color="#10b981" /> {sub.phone}
                                            </span>
                                        )}
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FiClock color="#94a3b8" /> {formatDate(sub.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteSubscription(sub.id)}
                                style={{
                                    width: 44, height: 44, borderRadius: '12px',
                                    background: '#fff', color: '#ef4444', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s', border: '1px solid #fee2e2'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}
                                title="Remove subscriber"
                            >
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
