import api from './api';

export const createPayment = (payload: { amount: number; customerName: string; customerEmail: string; customerPhone: string }) =>
	api.post('/payments/create', payload);

export const verifyPayment = (payload: any) => api.post('/payments/verify', payload);


