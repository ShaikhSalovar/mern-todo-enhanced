import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with auth header
const todoAxios = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
todoAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
todoAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getTodos = async (statusFilter, page, limit, search = '') => {
    let url = `/get?page=${page}&limit=${limit}`;
    if (statusFilter !== 'all') url += `&status=${statusFilter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await todoAxios.get(url);
    return response.data;
};

export const createTodo = async (task, priority, status) => {
    const response = await todoAxios.post('/add', { task, priority, status });
    return response.data;
};

export const updateTodoStatus = async (id, status) => {
    const response = await todoAxios.put(`/status/${id}`, { status });
    return response.data;
};

export const updateTodoTask = async (id, task) => {
    const response = await todoAxios.put(`/update/${id}`, { task });
    return response.data;
};

export const deleteTodo = async (id) => {
    const response = await todoAxios.delete(`/delete/${id}`);
    return response.data;
};
