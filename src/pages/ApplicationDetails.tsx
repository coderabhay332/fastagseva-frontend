import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../stores';
import { getAllApplications, updateApplicationStatus } from '../services/applications';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/StatusBadge';
import Select from '../components/ui/Select';
import { formatDate } from '../utils/dateUtils';

export default function ApplicationDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAppSelector(s => s.auth);
	const [application, setApplication] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [updatingStatus, setUpdatingStatus] = useState(false);

	useEffect(() => {
		// Check if user is admin
		if (!user || user.role !== 'ADMIN') {
			setError('Access denied. Admin privileges required.');
			return;
		}

		const loadApplication = async () => {
			if (!id) return;
			
			setLoading(true);
			setError(null);
			try {
				const res = await getAllApplications();
				if (res.data?.success && Array.isArray(res.data?.data)) {
					const foundApp = res.data.data.find((app: any) => app._id === id);
					if (foundApp) {
						setApplication(foundApp);
					} else {
						setError('Application not found');
					}
				} else if (Array.isArray(res.data)) {
					const foundApp = res.data.find((app: any) => app._id === id);
					if (foundApp) {
						setApplication(foundApp);
					} else {
						setError('Application not found');
					}
				} else {
					setError('Failed to load application data');
				}
			} catch (err: any) {
				console.error('Error loading application:', err);
				setError(err?.message || 'Failed to load application');
			} finally {
				setLoading(false);
			}
		};

		loadApplication();
	}, [id, user]);

	const handleBackToDashboard = () => {
		navigate('/admin');
	};

	const updateStatus = async (newStatus: string) => {
		if (!application?._id) return;
		
		setUpdatingStatus(true);
		setError(null);
		setSuccess(null);
		try {
			await updateApplicationStatus(application._id, newStatus as any);
			setApplication((prev: any) => ({ ...prev, status: newStatus }));
			setSuccess(`Application status updated to ${newStatus} successfully!`);
			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			console.error('Error updating status:', err);
			setError(err?.message || 'Failed to update status');
			// Clear error message after 5 seconds
			setTimeout(() => setError(null), 5000);
		} finally {
			setUpdatingStatus(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
				<div className="max-w-6xl mx-auto px-4">
					<div className="flex items-center justify-center py-12">
						<div className="flex items-center space-x-3">
							<svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span className="text-gray-600 text-lg">Loading application details...</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
				<div className="max-w-6xl mx-auto px-4">
					<div className="text-center py-12">
						<svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<h3 className="text-lg font-medium text-gray-900 mb-2">Error: {error}</h3>
						<Button onClick={handleBackToDashboard} className="mt-4">
							Back to Dashboard
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (!application) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
				<div className="max-w-6xl mx-auto px-4">
					<div className="text-center py-12">
						<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<h3 className="text-lg font-medium text-gray-900 mb-2">Application not found</h3>
						<Button onClick={handleBackToDashboard} className="mt-4">
							Back to Dashboard
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold gradient-text mb-2">Application Details</h1>
							<p className="text-gray-600 text-lg">
								Application ID: {application._id.slice(-8)} • Status: <StatusBadge status={application.status} />
							</p>
							<p className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">
								🔒 Admin Access Only • Images are read-only
							</p>
							{user && (
								<p className="text-sm text-gray-500 mt-2">
									Viewing as: {user.email} (Role: {user.role})
								</p>
							)}
						</div>
						<div className="flex space-x-3">
							<Button variant="outline" onClick={handleBackToDashboard}>
								← Back to Dashboard
							</Button>
						</div>
					</div>
				</div>

				{/* Success/Error Messages */}
				{success && (
					<div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
						<div className="flex items-center space-x-3">
							<svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span className="text-green-800 font-medium">{success}</span>
						</div>
					</div>
				)}

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

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Application Information */}
					<div className="lg:col-span-2 space-y-6">
						{/* User Information */}
						<Card className="shadow-elegant-lg">
							<CardHeader>
								<div className="flex items-center space-x-3">
									<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									<span>User Information</span>
								</div>
							</CardHeader>
							<CardBody>
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
										<p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
											{application.userId?.name || 'Not provided'}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
										<p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
											{application.userId?.email || 'Not provided'}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
										<p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
											{application.userId?.phone || 'Not provided'}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Number</label>
										<p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
											{application.userId?.panCardNumber || 'Not provided'}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
										<p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg font-mono">
											{application.userId?._id || 'Not available'}
										</p>
									</div>
								</div>
							</CardBody>
						</Card>

						{/* Vehicle Information */}
						<Card className="shadow-elegant-lg">
							<CardHeader>
								<div className="flex items-center space-x-3">
									<svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
									<span>Vehicle Information</span>
								</div>
							</CardHeader>
							<CardBody>
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
										<p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg">
											{application.vehicle || 'Not specified'}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Engine Number</label>
										<p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
											{application.engineNumber || 'Not provided'}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number</label>
										<p className="text-lg text-gray-900 bg-gray-50 p-3 rounded-lg font-mono">
											{application.chasisNumber || 'Not provided'}
										</p>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Application ID</label>
										<p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg font-mono">
											{application._id}
										</p>
									</div>
								</div>
							</CardBody>
						</Card>

						{/* Application Timeline */}
						<Card className="shadow-elegant-lg">
							<CardHeader>
								<div className="flex items-center space-x-3">
									<svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>Application Timeline</span>
								</div>
							</CardHeader>
							<CardBody>
								<div className="space-y-4">
									<div className="flex items-center space-x-4">
										<div className="w-3 h-3 bg-green-500 rounded-full"></div>
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-700">Created</label>
											<p className="text-sm text-gray-600">
												{formatDate(application.createdAt)}
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-700">Last Updated</label>
											<p className="text-sm text-gray-600">
												{formatDate(application.updatedAt)}
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<div className="w-3 h-3 bg-purple-500 rounded-full"></div>
										<div className="flex-1">
											<label className="block text-sm font-medium text-gray-700">Current Status</label>
											<div className="mt-1">
												<StatusBadge status={application.status} />
											</div>
										</div>
									</div>
									
									{/* Status Update Section */}
									<div className="mt-6 pt-4 border-t border-gray-200">
										<label className="block text-sm font-medium text-gray-700 mb-3">Update Status</label>
										<div className="flex items-center space-x-3">
											<Select 
												value={application.status} 
												onChange={e => updateStatus(e.target.value)}
												disabled={updatingStatus}
												className="flex-1"
											>
												<option value="NOT SUBMITTED">NOT SUBMITTED</option>
												<option value="PENDING">PENDING</option>
												<option value="AGENT ASSIGNED">AGENT ASSIGNED</option>
												<option value="REJECTED">REJECTED</option>
												<option value="DONE">DONE</option>
											</Select>
											{updatingStatus && (
												<svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
											)}
										</div>
										<p className="text-xs text-gray-500 mt-2">
											Select a new status to update the application
										</p>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>

					{/* Documents Section */}
					<div className="lg:col-span-1">
						<Card className="shadow-elegant-lg sticky top-24">
							<CardHeader>
								<div className="flex items-center space-x-3">
									<svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<span>Uploaded Documents</span>
								</div>
								<p className="text-xs text-gray-500 mt-2">
									📷 Images are read-only • Click to view full size
								</p>
							</CardHeader>
							<CardBody>
								<div className="space-y-4">
									{/* PAN Card */}
									{application.panImage && (
										<div className="bg-gray-50 rounded-lg p-4">
											<h4 className="font-medium text-gray-900 mb-3 flex items-center">
												<span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">P</span>
												PAN Card
											</h4>
											<div 
												className="relative group cursor-pointer"
												onClick={() => window.open(application.panImage, '_blank')}
											>
												<img 
													src={application.panImage} 
													alt="PAN Card" 
													className="w-full h-32 object-cover rounded border border-gray-200 hover:border-blue-400 transition-colors"
												/>
												<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center pointer-events-none">
													<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</div>
											</div>
											<p className="text-xs text-gray-500 mt-2 text-center">
												Click to view full size
											</p>
										</div>
									)}

									{/* RC Book */}
									{application.rcImage && (
										<div className="bg-gray-50 rounded-lg p-4">
											<h4 className="font-medium text-gray-900 mb-3 flex items-center">
												<span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">R</span>
												Registration Certificate
											</h4>
											<div 
												className="relative group cursor-pointer"
												onClick={() => window.open(application.rcImage, '_blank')}
											>
												<img 
													src={application.rcImage} 
													alt="RC Book" 
													className="w-full h-32 object-cover rounded border border-gray-200 hover:border-green-400 transition-colors"
												/>
												<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center pointer-events-none">
													<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</div>
											</div>
											<p className="text-xs text-gray-500 mt-2 text-center">
												Click to view full size
											</p>
										</div>
									)}

									{/* Vehicle Front Image */}
									{application.vehicleFrontImage && (
										<div className="bg-gray-50 rounded-lg p-4">
											<h4 className="font-medium text-gray-900 mb-3 flex items-center">
												<span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">F</span>
												Vehicle Front View
											</h4>
											<div 
												className="relative group cursor-pointer"
												onClick={() => window.open(application.vehicleFrontImage, '_blank')}
											>
												<img 
													src={application.vehicleFrontImage} 
													alt="Vehicle Front" 
													className="w-full h-32 object-cover rounded border border-gray-200 hover:border-purple-400 transition-colors"
												/>
												<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center pointer-events-none">
													<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</div>
											</div>
											<p className="text-xs text-gray-500 mt-2 text-center">
												Click to view full size
											</p>
										</div>
									)}

									{/* Vehicle Side Image */}
									{application.vehicleSideImage && (
										<div className="bg-gray-50 rounded-lg p-4">
											<h4 className="font-medium text-gray-900 mb-3 flex items-center">
												<span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">S</span>
												Vehicle Side View
											</h4>
											<div 
												className="relative group cursor-pointer"
												onClick={() => window.open(application.vehicleSideImage, '_blank')}
											>
												<img 
													src={application.vehicleSideImage} 
													alt="Vehicle Side" 
													className="w-full h-32 object-cover rounded border border-gray-200 hover:border-orange-400 transition-colors"
												/>
												<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center pointer-events-none">
													<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</div>
											</div>
											<p className="text-xs text-gray-500 mt-2 text-center">
												Click to view full size
											</p>
										</div>
									)}

									{/* No Documents Message */}
									{!application.panImage && !application.rcImage && !application.vehicleFrontImage && !application.vehicleSideImage && (
										<div className="text-center py-8">
											<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											<h3 className="text-sm font-medium text-gray-900 mb-2">No documents uploaded</h3>
											<p className="text-xs text-gray-500">
												This application doesn't have any uploaded documents yet.
											</p>
										</div>
									)}
								</div>

								{/* Document Legend */}
								<div className="mt-6 pt-4 border-t border-gray-200">
									<h4 className="text-sm font-medium text-gray-700 mb-3">Document Legend</h4>
									<div className="space-y-2 text-xs text-gray-600">
										<div className="flex items-center space-x-2">
											<span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">P</span>
											<span>PAN Card</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">R</span>
											<span>RC Book</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="w-4 h-4 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">F</span>
											<span>Vehicle Front</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">S</span>
											<span>Vehicle Side</span>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
					<h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
					<div className="grid md:grid-cols-3 gap-4">
						{application.status === 'PENDING' && (
							<Button 
								variant="primary" 
								onClick={() => updateStatus('AGENT ASSIGNED')}
								loading={updatingStatus}
								disabled={updatingStatus}
								className="w-full"
							>
								Assign Agent
							</Button>
						)}
						{application.status === 'AGENT ASSIGNED' && (
							<Button 
								variant="primary" 
								onClick={() => updateStatus('DONE')}
								loading={updatingStatus}
								disabled={updatingStatus}
								className="w-full"
							>
								Mark as Done
							</Button>
						)}
						{application.status === 'PENDING' && (
							<Button 
								variant="danger" 
								onClick={() => updateStatus('REJECTED')}
								loading={updatingStatus}
								disabled={updatingStatus}
								className="w-full"
							>
								Reject Application
							</Button>
						)}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="mt-8 flex justify-center space-x-4">
					<Button variant="outline" onClick={handleBackToDashboard}>
						← Back to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
