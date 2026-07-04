import apiClient from './apiClient';

export const supplierAPI = {
    // READ ALL
    getAll: () => apiClient.get('/api/supplier'),
    
    // READ ONE
    getById: (id) => apiClient.get(`/api/supplier/${id}`),
    
    // CREATE
    create: (data) => apiClient.post('/api/supplier', data),
    
    // UPDATE
    update: (id, data) => apiClient.put(`/api/supplier/${id}`, data),
    
    // DELETE
    delete: (id) => apiClient.delete(`/api/supplier/${id}`),
};