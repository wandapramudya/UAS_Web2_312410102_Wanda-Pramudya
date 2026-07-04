import apiClient from './apiClient';

export const authAPI = {
    login: (username, password) => {
        return apiClient.post('/auth/login', { username, password });
    },
    register: (username, password) => {
        return apiClient.post('/auth/register', { username, password });
    },
};