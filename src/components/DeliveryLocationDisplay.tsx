import { useState, useEffect } from 'react';
import { deliveryService, type DeliveryAddress } from '../services/delivery';
import Card, { CardBody, CardHeader } from './ui/Card';
import Button from './ui/Button';

interface DeliveryLocationDisplayProps {
  applicationId: string;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export default function DeliveryLocationDisplay({ 
  applicationId, 
  onEdit, 
  showEditButton = true 
}: DeliveryLocationDisplayProps) {
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeliveryDetails();
  }, [applicationId]);

  const loadDeliveryDetails = async () => {
    try {
      setLoading(true);
      const response = await deliveryService.getUserDeliveries();
      if (response.success && response.data) {
        const foundDelivery = response.data.find((d: any) => d.orderId === applicationId);
        setDelivery(foundDelivery);
      }
    } catch (err) {
      console.error('Error loading delivery:', err);
      setError('Failed to load delivery information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-elegant">
        <CardBody>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600">Loading delivery information...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-elegant">
        <CardBody>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={loadDeliveryDetails}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!delivery) {
    return (
      <Card className="shadow-elegant">
        <CardBody>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Delivery Location Set</h3>
            <p className="text-gray-600 mb-4">
              You haven't set a delivery location for your Fastag card yet.
            </p>
            {showEditButton && onEdit && (
              <Button onClick={onEdit} size="lg">
                Set Delivery Location
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }

  const { deliveryAddress, deliveryStatus, trackingNumber } = delivery;

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delivery Location</h3>
              <p className="text-sm text-gray-600">Your Fastag card delivery address</p>
            </div>
          </div>
          
          {showEditButton && onEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              Edit Location
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {/* Delivery Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Delivery Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
              deliveryStatus === 'in_transit' ? 'bg-blue-100 text-blue-800' :
              deliveryStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {deliveryStatus === 'delivered' ? 'Delivered' :
               deliveryStatus === 'in_transit' ? 'In Transit' :
               deliveryStatus === 'pending' ? 'Pending' :
               deliveryStatus}
            </span>
          </div>

          {/* Tracking Number */}
          {trackingNumber && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Tracking Number:</span>
              <span className="text-sm font-mono text-blue-800">{trackingNumber}</span>
            </div>
          )}

          {/* Address Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Delivery Address:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">House/Flat Number</p>
                    <p className="text-sm text-gray-900">{deliveryAddress.houseNumber}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pincode</p>
                    <p className="text-sm text-gray-900">{deliveryAddress.pincode}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Complete Address</p>
                    <p className="text-sm text-gray-900">{deliveryAddress.address}</p>
                  </div>
                </div>

                {deliveryAddress.nearby && (
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nearby Landmark</p>
                      <p className="text-sm text-gray-900">{deliveryAddress.nearby}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
        </div>
      </CardBody>
    </Card>
  );
}
