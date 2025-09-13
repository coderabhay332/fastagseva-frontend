import { useState, useEffect } from 'react';
import { useAppSelector } from '../stores';
import { getMyApplications } from '../services/applications';
import { deliveryService } from '../services/delivery';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/StatusBadge';
import DeliveryLocationForm from '../components/DeliveryLocationForm';
import DeliveryLocationDisplay from '../components/DeliveryLocationDisplay';
import { formatDate } from '../utils/dateUtils';

interface Application {
  _id: string;
  vehicle: string;
  engineNumber: string;
  chasisNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Delivery {
  _id: string;
  orderId: string;
  deliveryStatus: string;
  deliveryAddress: any;
  trackingNumber?: string;
}

export default function DeliveryManagement() {
  const { user } = useAppSelector(s => s.auth);
  const [applications, setApplications] = useState<Application[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load applications
      const appResponse = await getMyApplications();
      let apps: Application[] = [];
      if (appResponse.data?.success && Array.isArray(appResponse.data?.data)) {
        apps = appResponse.data.data;
      } else if (Array.isArray(appResponse.data)) {
        apps = appResponse.data;
      }
      setApplications(apps);

      // Load deliveries
      const deliveryResponse = await deliveryService.getUserDeliveries();
      if (deliveryResponse.success && deliveryResponse.data) {
        setDeliveries(deliveryResponse.data);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSetLocation = (applicationId: string) => {
    setSelectedApplication(applicationId);
    setShowForm(true);
    setEditingDelivery(null);
  };

  const handleEditLocation = (applicationId: string) => {
    setSelectedApplication(applicationId);
    setShowForm(true);
    setEditingDelivery(applicationId);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedApplication(null);
    setEditingDelivery(null);
    loadData(); // Reload data to show updated information
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedApplication(null);
    setEditingDelivery(null);
  };

  const getDeliveryForApplication = (applicationId: string) => {
    return deliveries.find(d => d.orderId === applicationId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading delivery information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Delivery Management</h1>
          <p className="text-gray-600 text-lg">Manage delivery locations for your Fastag applications</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-6">
          {applications.length === 0 ? (
            <Card className="shadow-elegant">
              <CardBody>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any Fastag applications yet.
                  </p>
                  <Button onClick={() => window.location.href = '/create'}>
                    Create Application
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            applications.map((app) => {
              const delivery = getDeliveryForApplication(app._id);
              const hasDelivery = !!delivery;

              return (
                <Card key={app._id} className="shadow-elegant">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Vehicle: {app.vehicle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Created on {formatDate(app.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <StatusBadge status={app.status} />
                        {hasDelivery && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            delivery.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                            delivery.deliveryStatus === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {delivery.deliveryStatus === 'delivered' ? 'Delivered' :
                             delivery.deliveryStatus === 'in_transit' ? 'In Transit' :
                             'Pending'}
                          </span>
                        )}
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

                      {/* Delivery Section */}
                      {showForm && selectedApplication === app._id ? (
                        <DeliveryLocationForm
                          applicationId={app._id}
                          isEdit={!!editingDelivery}
                          onSuccess={handleFormSuccess}
                          onCancel={handleCancel}
                        />
                      ) : (
                        <DeliveryLocationDisplay
                          applicationId={app._id}
                          onEdit={() => handleEditLocation(app._id)}
                          showEditButton={app.status !== 'rejected'}
                        />
                      )}

                      {/* Action Buttons */}
                      {!showForm && app.status !== 'rejected' && (
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                          {!hasDelivery ? (
                            <Button onClick={() => handleSetLocation(app._id)}>
                              Set Delivery Location
                            </Button>
                          ) : (
                            <Button variant="secondary" onClick={() => handleEditLocation(app._id)}>
                              Update Delivery Location
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
