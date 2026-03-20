import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────
export const login = (username, password) =>
  api.post('/api/auth/login', { username, password });

// ── Public Blogs ──────────────────────────────────────────────
export const getPublishedBlogs = () => api.get('/api/blogs');
export const getPublishedBlog = (id) => api.get(`/api/blogs/${id}`);

// ── Admin Blogs ───────────────────────────────────────────────
export const adminGetBlogs = () => api.get('/api/admin/blogs');
export const adminGetTrash = () => api.get('/api/admin/trash');
export const adminCreateBlog = (data) => api.post('/api/admin/blogs', data);
export const adminUpdateBlog = (id, data) => api.put(`/api/admin/blogs/${id}`, data);
export const adminDeleteBlog = (id) => api.delete(`/api/admin/blogs/${id}`);
export const adminRestoreBlog = (id) => api.put(`/api/admin/blogs/${id}/restore`);
export const adminPermanentDelete = (id) => api.delete(`/api/admin/blogs/${id}/permanent`);

export const uploadImage = (file, type = "image") => {
  const form = new FormData();
  form.append('file', file);
  form.append('type', type);
  return api.post('/api/admin/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── Media ─────────────────────────────────────────────────────
export const getMedia = (type = null) => {
  const url = type ? `/api/admin/media?type=${type}` : '/api/admin/media';
  return api.get(url);
};
export const deleteMedia = (id) => api.delete(`/api/admin/media/${id}`);

export default api;
