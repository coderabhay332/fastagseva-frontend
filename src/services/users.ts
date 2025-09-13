import api from './api';

export const login = (email: string, password: string) => api.post('/users/login', { email, password });
export const signup = (userData: { name: string; email: string; password: string; confirmPassword: string }) => 
	api.post('/users/create', userData);
export const me = () => api.get('/users/me');


export const forgotPassword = (email: string) => api.post('/users/forgot-password', { email });
export const resetPassword = (data: { token: string; password: string; confirmPassword: string }) => 
    api.post('/users/reset-password', data);

