import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + '/api/auth';

// Create axios instance with auth header
const authAxios = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
authAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const register = async (name, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
};

export const verifyToken = async () => {
    const response = await authAxios.get('/verify');
    return response.data;
};

export const getProfile = async () => {
    const response = await authAxios.get('/profile');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await authAxios.put('/profile', profileData);
    return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
    const response = await authAxios.put('/change-password', { currentPassword, newPassword });
    return response.data;
};
