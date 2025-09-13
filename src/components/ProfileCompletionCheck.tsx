import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profile';
import Card, { CardBody, CardHeader } from './ui/Card';
import Button from './ui/Button';

interface ProfileCompletionCheckProps {
  children: React.ReactNode;
}

export default function ProfileCompletionCheck({ children }: ProfileCompletionCheckProps) {
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const response = await profileService.getProfile();
        const profile = response.data;
        
        // Check if required fields are filled (profile photo is optional)
        const hasRequiredFields = profile.phone && profile.pancardNumber && profile.dateOfBirth;
        setIsProfileComplete(!!hasRequiredFields);
      } catch (error) {
        // If profile doesn't exist or there's an error, consider it incomplete
        setIsProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfileCompletion();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600 text-lg">Checking profile completion...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Profile Completion Required</h1>
            <p className="text-gray-600 text-lg">Please complete your profile before creating a new application</p>
          </div>

          <Card className="shadow-elegant-lg">
            <CardHeader>
              Complete Your Profile
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="h-6 w-6 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-2">Required Information:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Phone Number</li>
                        <li>PAN Card Number</li>
                        <li>Date of Birth</li>
                        <li className="text-gray-600">Profile Photo (Optional)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="h-6 w-6 text-yellow-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Why is this required?</p>
                      <p>We need your basic information to process Fastag applications and ensure compliance with regulatory requirements.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => navigate('/profile')}
                    className="w-full"
                    size="lg"
                  >
                    Complete Profile Now
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Already completed your profile? <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">Refresh</button>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // If profile is complete, render the children (CreateApplication component)
  return <>{children}</>;
}
