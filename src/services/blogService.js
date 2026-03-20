const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Public API (used by main site) ────────────────────────────────────────────

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
};

export default blogService;
