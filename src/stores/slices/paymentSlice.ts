import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface PaymentState {
	loading: boolean;
	error: string | null;
	current: any | null;
}

const initialState: PaymentState = { loading: false, error: null, current: null };

export const createPaymentThunk = createAsyncThunk(
	'payment/create',
	async (
		payload: { 
			amount: number; 
			customerName: string; 
			customerEmail: string; 
			customerPhone: string;
			applicationId: string;
			bankName: string;
		},
		{ rejectWithValue }
	) => {
		try {
			const res = await api.post('/payments/create', payload);
			return res.data;
		} catch (err: any) {
			return rejectWithValue(err?.message || 'Payment init failed');
		}
	}
);

const paymentSlice = createSlice({
	name: 'payment',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createPaymentThunk.pending, (state) => { state.loading = true; state.error = null; })
			.addCase(createPaymentThunk.fulfilled, (state, action: PayloadAction<any>) => {
				state.loading = false; state.current = action.payload?.data || action.payload;
			})
			.addCase(createPaymentThunk.rejected, (state, action: any) => {
				state.loading = false; state.error = action.payload;
			});
	},
});

export default paymentSlice.reducer;


