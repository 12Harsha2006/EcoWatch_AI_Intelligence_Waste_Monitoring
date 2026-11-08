import api, { BASE_URL } from './api';

const TOKEN_KEY = 'waste_surveillance_token';
const USER_KEY = 'waste_surveillance_user';

export const authService = {
  /**
   * Authenticate administrator against backend
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    
    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { token: access_token, user };
  },

  /**
   * Terminate administrator session
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Fetch current authenticated user profile
   */
  async getCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      // If token expired or invalid, wipe session
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  /**
   * Get cached token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get cached user profile
   */
  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export default authService;
