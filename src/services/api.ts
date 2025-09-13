import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
	baseURL: API_BASE_URL,
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
	const stored = localStorage.getItem('auth');
	if (stored) {
		try {
			const { accessToken } = JSON.parse(stored) as { accessToken?: string };
			if (accessToken) {
				config.headers = config.headers || {};
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
		} catch {}
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(
			error?.response?.data ?? {
				success: false,
				message: error?.message || 'Network error',
				status: error?.response?.status,
			}
		);
	}
);

export default api;


