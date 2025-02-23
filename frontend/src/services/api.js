import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL.endsWith('/api/v1') 
    ? import.meta.env.VITE_API_URL.slice(0, -7) // Remove /api/v1 if it exists
    : import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Always prepend /api/v1 to the URL unless it's already there
        if (!config.url.startsWith('/api/v1')) {
            config.url = `/api/v1${config.url}`;
        }
        
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.data);
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default api; 