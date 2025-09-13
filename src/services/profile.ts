import api from './api';

export interface ProfileData {
  phone?: string;
  pancardNumber?: string;
  dateOfBirth?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    phone?: string;
    pancardNumber?: string;
    dateOfBirth?: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export const profileService = {
  // Get profile information
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/profiles/me');
    return response.data;
  },

  // Update profile information
  updateProfile: async (profileData: ProfileData): Promise<ProfileResponse> => {
    const response = await api.post('/profiles/update', profileData);
    return response.data;
  },

  // Upload profile image
  uploadImage: async (file: File): Promise<{ success: boolean; data: { url: string }; message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/profiles/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
