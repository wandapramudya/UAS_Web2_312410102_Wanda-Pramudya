import apiClient from './apiClient';

export const kategoriAPI = {
    // READ ALL
    getAll: () => apiClient.get('/api/kategori'),
    
    // READ ONE
    getById: (id) => apiClient.get(`/api/kategori/${id}`),
    
    // CREATE
    create: (data) => apiClient.post('/api/kategori', data),
    
    // UPDATE
    update: (id, data) => apiClient.put(`/api/kategori/${id}`, data),
    
    // DELETE
    delete: (id) => apiClient.delete(`/api/kategori/${id}`),
};