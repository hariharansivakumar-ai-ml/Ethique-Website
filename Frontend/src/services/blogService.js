import { config } from '../config';

const API_URL = config.API_URL;

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
