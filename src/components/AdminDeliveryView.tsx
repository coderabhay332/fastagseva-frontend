import { useState, useEffect } from 'react';
import { deliveryService } from '../services/delivery';
import Card, { CardBody, CardHeader } from './ui/Card';
import Button from './ui/Button';
import { formatDate } from '../utils/dateUtils';

interface Delivery {
  _id: string;
  userId: any;
  orderId: string;
  deliveryStatus: string;
  deliveryAddress: {    
    pincode: string;
    nearby?: string;
    address: string;
    houseNumber: string;
  };
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminDeliveryViewProps {
  applications: any[];
}

export default function AdminDeliveryView({ applications }: AdminDeliveryViewProps) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updatingTracking, setUpdatingTracking] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      // For admin, we need to get all deliveries
      // Since the current API only supports user-specific deliveries,
      // we'll need to extend the backend to support admin access
      // For now, we'll show a placeholder
      setDeliveries([]);
    } catch (err) {
      console.error('Error loading deliveries:', err);
      setError('Failed to load delivery information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = async (deliveryId: string) => {
    if (!trackingNumber.trim()) return;
    
    setUpdatingTracking(true);
    try {
      // Update tracking number logic would go here
      // This would require extending the backend API
      console.log('Updating tracking number for delivery:', deliveryId, trackingNumber);
      
      // For now, just close the modal
      setSelectedDelivery(null);
      setTrackingNumber('');
    } catch (err) {
      console.error('Error updating tracking:', err);
    } finally {
      setUpdatingTracking(false);
    }
  };

  const getDeliveryForApplication = (applicationId: string) => {
    return deliveries.find(d => d.orderId === applicationId);
  };

  const getApplicationForDelivery = (orderId: string) => {
    return applications.find(a => a._id === orderId);
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
              onClick={loadDeliveries}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Filter applications that have delivery information
  const applicationsWithDelivery = applications.filter(app => {
    const delivery = getDeliveryForApplication(app._id);
    return delivery && delivery.deliveryAddress;
  });

  if (applicationsWithDelivery.length === 0) {
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Delivery Information Available</h3>
            <p className="text-gray-600">
              No applications have delivery locations set yet.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Management</h2>
        <p className="text-gray-600">View and manage delivery locations for all applications</p>
      </div>

      {applicationsWithDelivery.map((app) => {
        const delivery = getDeliveryForApplication(app._id);
        if (!delivery) return null;

        return (
          <Card key={app._id} className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Vehicle: {app.vehicle}
                    </h3>
                    <p className="text-sm text-gray-600">
                      User: {app.userId?.name || app.userId?.email || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    delivery.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                    delivery.deliveryStatus === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {delivery.deliveryStatus === 'delivered' ? 'Delivered' :
                     delivery.deliveryStatus === 'in_transit' ? 'In Transit' :
                     'Pending'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Engine Number:</span>
                    <p className="text-gray-900 font-mono">{app.engineNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Chassis Number:</span>
                    <p className="text-gray-900 font-mono">{app.chasisNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Application Status:</span>
                    <p className="text-gray-900">{app.status}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Delivery Address:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">House/Flat:</span>
                        <p className="text-sm text-gray-900">{delivery.deliveryAddress.houseNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Pincode:</span>
                        <p className="text-sm text-gray-900">{delivery.deliveryAddress.pincode}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Address:</span>
                        <p className="text-sm text-gray-900">{delivery.deliveryAddress.address}</p>
                      </div>
                      {delivery.deliveryAddress.nearby && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Landmark:</span>
                          <p className="text-sm text-gray-900">{delivery.deliveryAddress.nearby}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tracking Information:</h4>
                      {delivery.trackingNumber ? (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Tracking Number:</span> {delivery.trackingNumber}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">No tracking number assigned yet</p>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedDelivery(delivery._id)}
                    >
                      {delivery.trackingNumber ? 'Update Tracking' : 'Add Tracking'}
                    </Button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="text-xs text-gray-500">
                  <p>Delivery created: {formatDate(delivery.createdAt)}</p>
                  {delivery.updatedAt !== delivery.createdAt && (
                    <p>Last updated: {formatDate(delivery.updatedAt)}</p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}

      {/* Tracking Number Update Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Tracking Number</h3>
            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-3 mt-4">
              <Button
                onClick={() => handleUpdateTracking(selectedDelivery)}
                loading={updatingTracking}
                className="flex-1"
              >
                Update
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedDelivery(null);
                  setTrackingNumber('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
