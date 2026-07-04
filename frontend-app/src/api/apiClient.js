import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

// ============================================
// INTERCEPTOR REQUEST - KIRIM TOKEN
// ============================================
apiClient.interceptors.request.use(
    (config) => {
        // LEWATKAN TOKEN UNTUK ENDPOINT AUTH
        const isAuthEndpoint = config.url.includes('/auth/login') || 
                               config.url.includes('/auth/register');
        
        if (!isAuthEndpoint) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('✅ Token terpasang di header');
            } else {
                console.warn('⚠️ Token tidak ditemukan!');
            }
        } else {
            console.log('📤 Auth endpoint, tanpa token');
        }
        
        console.log('📤 Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// ============================================
// INTERCEPTOR RESPONSE - HANDLE ERROR
// ============================================
apiClient.interceptors.response.use(
    (response) => {
        console.log('📥 Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            console.warn('⚠️ Token invalid/expired, redirect ke login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;