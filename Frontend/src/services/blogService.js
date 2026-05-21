import { config } from '../config';

const API_URL = config.API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const blogService = {
  /**
   * Get all published blogs from the API
   */
  getBlogs: async () => {
    const res = await fetch(`${API_URL}/api/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  /**
   * Get a single published blog by ID
   */
  getBlogById: async (id) => {
    const res = await fetch(`${API_URL}/api/blogs/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  // ── Admin API (requires JWT Bearer Token) ────────────────────────────────────────

  /**
   * Login as admin
   */
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }
    return res.json();
  },

  /**
   * Get all blogs (including drafts and soft-deleted) for Admin
   */
  adminGetBlogs: async () => {
    const res = await fetch(`${API_URL}/api/admin/blogs`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
      }
      throw new Error('Failed to fetch admin blogs');
    }
    return res.json();
  },

  /**
   * Create a new blog post
   */
  adminCreateBlog: async (data) => {
    const res = await fetch(`${API_URL}/api/admin/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create blog');
    }
    return res.json();
  },

  /**
   * Update an existing blog post
   */
  adminUpdateBlog: async (id, data) => {
    const res = await fetch(`${API_URL}/api/admin/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update blog');
    }
    return res.json();
  },

  /**
   * Delete a blog post (soft delete by default)
   */
  adminDeleteBlog: async (id) => {
    const res = await fetch(`${API_URL}/api/admin/blogs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to delete blog');
    }
    return res.json();
  },
};

export default blogService;
