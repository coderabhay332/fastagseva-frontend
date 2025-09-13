import { useState, useEffect } from 'react';
import { useAppSelector } from '../stores';
import { deliveryService, type DeliveryAddress, type DeliveryData } from '../services/delivery';
import Card, { CardBody, CardHeader } from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

interface DeliveryLocationFormProps {
  applicationId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function DeliveryLocationForm({ 
  applicationId, 
  onSuccess, 
  onCancel, 
  isEdit = false 
}: DeliveryLocationFormProps) {
  const { user } = useAppSelector(s => s.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<DeliveryAddress>({
    pincode: '',
    nearby: '',
    address: '',
    houseNumber: ''
  });

  useEffect(() => {
    if (isEdit) {
      loadExistingDelivery();
    }
  }, [isEdit, applicationId]);

  const loadExistingDelivery = async () => {
    try {
      const response = await deliveryService.getUserDeliveries();
      if (response.success && response.data) {
        const delivery = response.data.find((d: any) => d.orderId === applicationId);
        if (delivery) {
          setFormData(delivery.deliveryAddress);
        }
      }
    } catch (err) {
      console.error('Error loading delivery:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const deliveryData: DeliveryData = {
        orderId: applicationId,
        deliveryAddress: formData,
        trackingNumber: ''
      };

      if (isEdit) {
        await deliveryService.updateDelivery(deliveryData);
        setSuccess('Delivery location updated successfully!');
      } else {
        await deliveryService.createDelivery(deliveryData);
        setSuccess('Delivery location set successfully!');
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error saving delivery:', err);
      setError(err?.message || 'Failed to save delivery location');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="shadow-elegant-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEdit ? 'Update Delivery Location' : 'Set Delivery Location'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEdit 
                ? 'Update your delivery address for Fastag card delivery'
                : 'Set your delivery address to receive your Fastag card'
              }
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="House/Flat Number"
              placeholder="e.g., A-101, Flat 5"
              value={formData.houseNumber}
              onChange={e => handleInputChange('houseNumber', e.target.value)}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                </svg>
              }
              required
            />
            
            <Input
              label="Pincode"
              placeholder="e.g., 400001"
              value={formData.pincode}
              onChange={e => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              required
            />
          </div>

          <Input
            label="Complete Address"
            placeholder="e.g., Building name, Street, Area, City"
            value={formData.address}
            onChange={e => handleInputChange('address', e.target.value)}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            required
          />

          <Input
            label="Nearby Landmark (Optional)"
            placeholder="e.g., Near Metro Station, Opposite Mall"
            value={formData.nearby || ''}
            onChange={e => handleInputChange('nearby', e.target.value)}
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Delivery Information:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Your Fastag card will be delivered to this address</li>
                  <li>Ensure someone is available to receive the delivery</li>
                  <li>Delivery typically takes 3-5 business days</li>
                  <li>You can update this address anytime before delivery</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
              size="lg"
            >
              {isEdit ? 'Update Location' : 'Set Location'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
            )}
          </div>

          {error && (
            <div className="text-center">
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="text-center">
              <p className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
                {success}
              </p>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
