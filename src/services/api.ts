import axios from 'axios';

const API_BASE_URL = 'https://fasttagseva.onrender.com/api';

export const api = axios.create({
	baseURL: API_BASE_URL,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: any) => void;
	reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});
	
	failedQueue = [];
};

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
	async (error) => {
		const originalRequest = error.config;

		// Check if error is due to expired token (401) and we haven't already tried to refresh
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// If already refreshing, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(token => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return api(originalRequest);
				}).catch(err => {
					return Promise.reject(err);
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const stored = localStorage.getItem('auth');
				if (!stored) throw new Error('No auth data found');

				const { refreshToken } = JSON.parse(stored) as { refreshToken?: string };
				if (!refreshToken) throw new Error('No refresh token found');

				// Call refresh token endpoint
				const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, { refreshToken });
				const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data?.data ?? response.data;

				// Update localStorage with new tokens
				const authData = JSON.parse(stored);
				authData.accessToken = newAccessToken;
				authData.refreshToken = newRefreshToken;
				localStorage.setItem('auth', JSON.stringify(authData));

				// Update the original request with new token
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				// Process queued requests
				processQueue(null, newAccessToken);

				// Retry the original request
				return api(originalRequest);
			} catch (refreshError) {
				// Refresh failed, clear auth data and redirect to login
				localStorage.removeItem('auth');
				processQueue(refreshError, null);
				
				// Redirect to login page
				window.location.href = '/login';
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

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


