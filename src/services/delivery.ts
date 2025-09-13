import api from './api';

export interface DeliveryAddress {
  pincode: string;
  nearby?: string;
  address: string;
  houseNumber: string;
}

export interface DeliveryData {
  orderId: string;
  deliveryAddress: DeliveryAddress;
  trackingNumber?: string;
}

export const deliveryService = {
  // Create delivery for an application
  createDelivery: async (data: DeliveryData) => {
    const response = await api.post('/delivery/create', data);
    return response.data;
  },

  // Get delivery details for a user
  getUserDeliveries: async () => {
    const response = await api.get('/delivery/get-delivery');
    return response.data;
  },

  // Update delivery address
  updateDelivery: async (data: DeliveryData) => {
    const response = await api.put('/delivery/update-delivery', data);
    return response.data;
  },

  // Get delivery by order ID (for admin)
  getDeliveryByOrderId: async (orderId: string) => {
    const response = await api.get(`/delivery/get-delivery/${orderId}`);
    return response.data;
  }
};
