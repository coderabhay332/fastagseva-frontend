import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	user: { id: string; email: string; role: 'USER' | 'ADMIN'; name?: string; phone?: string } | null;
	loading: boolean;
	error: string | null;
	success: string | null;
}

const initialState: AuthState = (() => {
	try {
		const stored = localStorage.getItem('auth');
		if (stored) return { ...JSON.parse(stored), loading: false, error: null } as AuthState;
	} catch {}
	return { accessToken: null, refreshToken: null, user: null, loading: false, error: null, success: null };
})();

export const loginThunk = createAsyncThunk(
	'auth/login',
	async (payload: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const res = await api.post('/users/login', payload);
			// Assuming backend sets response structure: { data: { accessToken, refreshToken, user } }
			return res.data?.data ?? res.data;
		} catch (err: any) {
			return rejectWithValue(err?.message || 'Login failed');
		}
	}
);

export const signupThunk = createAsyncThunk(
	'auth/signup',
	async (payload: { name: string; email: string; password: string; confirmPassword: string }, { rejectWithValue }) => {
		try {
			const res = await api.post('/users/create', payload);
			return res.data?.data ?? res.data;
		} catch (err: any) {
			return rejectWithValue(err?.message || 'Signup failed');
		}
	}
);

export const refreshTokenThunk = createAsyncThunk(
	'auth/refreshToken',
	async (_, { rejectWithValue }) => {
		try {
			const stored = localStorage.getItem('auth');
			if (!stored) throw new Error('No refresh token found');
			
			const { refreshToken } = JSON.parse(stored) as { refreshToken?: string };
			if (!refreshToken) throw new Error('No refresh token found');
			
			const res = await api.post('/users/refresh-token', { refreshToken });
			return res.data?.data ?? res.data;
		} catch (err: any) {
			// Clear auth data if refresh fails
			localStorage.removeItem('auth');
			return rejectWithValue(err?.response?.data?.message || 'Token refresh failed');
		}
	}
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
	localStorage.removeItem('auth');
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuth(state, action: PayloadAction<{ accessToken: string; refreshToken?: string; user: AuthState['user'] }>) {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken || null;
			state.user = action.payload.user;
			localStorage.setItem('auth', JSON.stringify({ 
				accessToken: state.accessToken, 
				refreshToken: state.refreshToken,
				user: state.user 
			}));
		},
		clearSuccess(state) {
			state.success = null;
		},
		clearError(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginThunk.fulfilled, (state, action: PayloadAction<any>) => {
				state.loading = false;
				const accessToken = action.payload?.accessToken || action.payload?.token;
				const refreshToken = action.payload?.refreshToken;
				const user = action.payload?.user || null;
				state.accessToken = accessToken;
				state.refreshToken = refreshToken;
				state.user = user;
				localStorage.setItem('auth', JSON.stringify({ accessToken, refreshToken, user }));
			})
			.addCase(loginThunk.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload || 'Login failed';
			})
			.addCase(signupThunk.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.success = null;
			})
			.addCase(signupThunk.fulfilled, (state, action: PayloadAction<any>) => {
				state.loading = false;
				state.success = 'Registration successful! Welcome to Fastag!';
				const accessToken = action.payload?.accessToken || action.payload?.token;
				const refreshToken = action.payload?.refreshToken;
				const user = action.payload?.user || null;
				state.accessToken = accessToken;
				state.refreshToken = refreshToken;
				state.user = user;
				localStorage.setItem('auth', JSON.stringify({ accessToken, refreshToken, user }));
			})
			.addCase(signupThunk.rejected, (state, action: any) => {
				state.loading = false;
				state.error = action.payload || 'Signup failed';
			})
			.addCase(refreshTokenThunk.fulfilled, (state, action: PayloadAction<any>) => {
				const accessToken = action.payload?.accessToken || action.payload?.token;
				const refreshToken = action.payload?.refreshToken;
				state.accessToken = accessToken;
				state.refreshToken = refreshToken;
				localStorage.setItem('auth', JSON.stringify({ 
					accessToken, 
					refreshToken, 
					user: state.user 
				}));
			})
			.addCase(refreshTokenThunk.rejected, (state) => {
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
				state.loading = false;
				state.error = 'Session expired. Please login again.';
			})
			.addCase(logoutThunk.fulfilled, (state) => {
				state.accessToken = null;
				state.refreshToken = null;
				state.user = null;
				state.loading = false;
				state.error = null;
			});
	},
});

export const { setAuth, clearSuccess, clearError } = authSlice.actions;
export default authSlice.reducer;


