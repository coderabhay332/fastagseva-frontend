import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export type ApplicationStatus = 'NOT SUBMITTED' | 'PENDING' | 'AGENT ASSIGNED' | 'REJECTED' | 'DONE';

export interface ApplicationState {
	currentId: string | null;
	data: any | null;
	status: ApplicationStatus | null;
	loading: boolean;
	error: string | null;
}

const initialState: ApplicationState = {
	currentId: null,
	data: null,
	status: null,
	loading: false,
	error: null,
};

export const createApplicationThunk = createAsyncThunk(
	'application/create',
	async (payload: { vehicle: string; engineNumber: string; chasisNumber: string }, { rejectWithValue }) => {
		try {
			const res = await api.post('/applications/create', payload);
			return res.data?.data || res.data;
		} catch (err: any) {
			return rejectWithValue(err?.message || 'Failed to create application');
		}
	}
);

export const getMyApplicationsThunk = createAsyncThunk(
	'application/my',
	async (_, { rejectWithValue }) => {
		try {
			const res = await api.get('/applications/my-application');
			return res.data?.data || [];
		} catch (err: any) {
			return rejectWithValue(err?.message || 'Failed to fetch applications');
		}
	}
);

export const getApplicationByIdThunk = createAsyncThunk(
	'application/getById',
	async (id: string, { rejectWithValue }) => {
		try {
			const res = await api.get(`/applications/${id}`);
			return res.data?.data || null;
		} catch (err: any) {
			return rejectWithValue(err?.message || 'Failed to fetch application');
		}
	}
);

export const uploadFileThunk = createAsyncThunk(
	'application/upload',
	async (
		payload: { id: string; type: 'pan' | 'rc' | 'vehicle-front' | 'vehicle-side'; file: File },
		{ rejectWithValue }
	) => {
		try {
			const formData = new FormData();
			formData.append('file', payload.file);
			let path = '';
			if (payload.type === 'pan') path = `/applications/upload-pan/${payload.id}`;
			if (payload.type === 'rc') path = `/applications/upload-rc/${payload.id}`;
			if (payload.type === 'vehicle-front') path = `/applications/upload-vehicle-front/${payload.id}`;
			if (payload.type === 'vehicle-side') path = `/applications/upload-vehicle-side/${payload.id}`;
			const res = await api.post(path, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
			return res.data?.data || res.data;
		} catch (err: any) {
			return rejectWithValue(err?.message || 'File upload failed');
		}
	}
);

const applicationSlice = createSlice({
	name: 'application',
	initialState,
	reducers: {
		setCurrentApplication(state, action: PayloadAction<{ id: string; data?: any }>) {
			state.currentId = action.payload.id;
			if (action.payload.data) state.data = action.payload.data;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createApplicationThunk.pending, (state) => {
				state.loading = true; state.error = null;
			})
			.addCase(createApplicationThunk.fulfilled, (state, action: PayloadAction<any>) => {
				state.loading = false; state.data = action.payload; state.currentId = action.payload?._id || action.payload?.id || state.currentId;
				state.status = action.payload?.status || state.status;
			})
			.addCase(createApplicationThunk.rejected, (state, action: any) => {
				state.loading = false; state.error = action.payload;
			})
			.addCase(getApplicationByIdThunk.fulfilled, (state, action: PayloadAction<any>) => {
				state.data = action.payload; state.currentId = action.payload?._id || state.currentId; state.status = action.payload?.status || state.status;
			})
			.addCase(uploadFileThunk.fulfilled, () => {
				// no-op; caller can refresh
			});
	},
});

export const { setCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;


