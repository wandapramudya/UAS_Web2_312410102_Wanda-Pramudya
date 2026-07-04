import apiClient from './apiClient';

export const barangAPI = {
    // READ ALL
    getAll: () => apiClient.get('/api/barang'),
    
    // READ ONE
    getById: (id) => apiClient.get(`/api/barang/${id}`),
    
    // CREATE
    create: (data) => apiClient.post('/api/barang', data),
    
    // UPDATE
    update: (id, data) => apiClient.put(`/api/barang/${id}`, data),
    
    // DELETE
    delete: (id) => apiClient.delete(`/api/barang/${id}`),
    
    // SEARCH
    search: (keyword) => apiClient.get(`/api/barang/search?keyword=${keyword}`),
};