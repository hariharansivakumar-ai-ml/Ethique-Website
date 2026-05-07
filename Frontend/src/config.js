/**
 * Sri Ponni Frontend Configuration
 * Centralizing all environment variables and API endpoints.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const config = {
  API_URL,
  /**
   * Helper to build full API paths
   */
  apiPath: (path) => `${API_URL}${path.startsWith('/') ? path : '/' + path}`,
};

export default config;
