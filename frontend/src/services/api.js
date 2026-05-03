// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,   // MUST be true — lets the HttpOnly jwt cookie flow through Vite proxy
});

// ── Data endpoints ──────────────────────────────────────────────────────────
export const getPortfolio   = ()       => api.get('/get_portfolio.php');
export const getInventory   = ()       => api.get('/get_inventory.php');
export const getHistory     = (params) => api.get('/get_history.php', { params });
export const getProfile     = ()       => api.get('/get_profile.php');
export const getAssets      = (type)   => api.get('/get_assets.php', { params: { type } });
export const addTransaction = (data)   => api.post('/add_transaction.php', data);

// ── Auth endpoints ───────────────────────────────────────────────────────────
export const authMe       = ()     => api.get('/auth_me.php');
export const authLogin    = (data) => api.post('/auth_login.php', data);
export const authLogout   = ()     => api.post('/auth_logout.php');
export const authRegister = (data) => api.post('/auth_register.php', data);

export default api;
