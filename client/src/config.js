export const API_URL = (process.env.NODE_ENV === 'production') ? '/api' : 'http://localhost:8000/api';
export const SOCKET_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8000';