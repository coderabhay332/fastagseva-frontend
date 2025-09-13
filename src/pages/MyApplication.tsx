import { useEffect, useState } from 'react';
import { useAppSelector } from '../stores';
import { getMyApplications } from '../services/applications';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import DeliveryLocationDisplay from '../components/DeliveryLocationDisplay';
import DeliveryLocationForm from '../components/DeliveryLocationForm';

interface Application {
	_id: string;
	vehicle: string;
	engineNumber: string;
	chasisNumber: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	panImage?: string;
	rcImage?: string;
	vehicleFrontImage?: string;
	vehicleSideImage?: string;
}

export default function MyApplication() {
	const { user } = useAppSelector(s => s.auth);
	const [applications, setApplications] = useState<Application[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
	const [showDeliveryForm, setShowDeliveryForm] = useState(false);
	const [editingDelivery, setEditingDelivery] = useState<string | null>(null);

	useEffect(() => {
		const loadApplications = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await getMyApplications();
				if (response.data?.success && Array.isArray(response.data?.data)) {
					setApplications(response.data.data);
				} else if (Array.isArray(response.data)) {
					setApplications(response.data);
				} else {
					setError('Unexpected response structure from server');
				}
			} catch (err: any) {
				console.error('Error loading applications:', err);
				setError(err?.message || 'Failed to load applications');
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			loadApplications();
		}
	}, [user]);



	const getDocumentCount = (app: Application) => {
		let count = 0;
		if (app.panImage) count++;
		if (app.rcImage) count++;
		if (app.vehicleFrontImage) count++;
		if (app.vehicleSideImage) count++;
		return count;
	};

	const handleSetDeliveryLocation = (applicationId: string) => {
		setSelectedApplication(applicationId);
		setShowDeliveryForm(true);
		setEditingDelivery(null);
	};

	const handleEditDeliveryLocation = (applicationId: string) => {
		setSelectedApplication(applicationId);
		setShowDeliveryForm(true);
		setEditingDelivery(applicationId);
	};

	const handleDeliveryFormSuccess = () => {
		setShowDeliveryForm(false);
		setSelectedApplication(null);
		setEditingDelivery(null);
	};

	const handleDeliveryFormCancel = () => {
		setShowDeliveryForm(false);
		setSelectedApplication(null);
		setEditingDelivery(null);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
				<div className="max-w-6xl mx-auto px-4">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
						<p className="mt-4 text-gray-600">Loading your applications...</p>
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
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold gradient-text mb-2">My Applications</h1>
					<p className="text-gray-600 text-lg">View and track all your Fastag applications</p>
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
				{applications.length === 0 ? (
					<Card className="shadow-elegant-lg">
						<CardBody className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
								<svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
							<p className="text-gray-600 mb-6">Create your first Fastag application to get started</p>
							<Link
								to="/create"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
							>
								Create Application
							</Link>
						</CardBody>
					</Card>
				) : (
					<div className="grid gap-6">
						{applications.map((app) => (
							<Card key={app._id} className="shadow-elegant-lg">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
												<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
												</svg>
											</div>
											<div>
												<h3 className="text-lg font-semibold text-gray-900">{app.vehicle}</h3>
												<p className="text-sm text-gray-600">Application ID: {app._id.slice(-8)}</p>
											</div>
										</div>
										<div className="flex items-center space-x-3">
											<StatusBadge status={app.status} />
											<Link
												to={`/status/${app._id}`}
												className="text-blue-600 hover:text-blue-800 text-sm font-medium"
											>
												View Status
											</Link>
											<Link
												to={`/application/edit/${app._id}`}
												className="text-gray-600 hover:text-gray-900 text-sm font-medium"
											>
												Edit Details
											</Link>
										</div>
									</div>
								</CardHeader>
								<CardBody>
									<div className="grid md:grid-cols-2 gap-6">
										{/* Application Details */}
										<div className="space-y-4">
											<div>
												<h4 className="font-medium text-gray-900 mb-2">Vehicle Information</h4>
												<div className="bg-gray-50 rounded-lg p-3 space-y-2">
													<div className="flex justify-between">
														<span className="text-sm text-gray-600">Engine Number:</span>
														<span className="text-sm font-medium">{app.engineNumber}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-sm text-gray-600">Chassis Number:</span>
														<span className="text-sm font-medium">{app.chasisNumber}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-sm text-gray-600">Created:</span>
														<span className="text-sm font-medium">{formatDate(app.createdAt)}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-sm text-gray-600">Last Updated:</span>
														<span className="text-sm font-medium">{formatDate(app.updatedAt)}</span>
													</div>
												</div>
											</div>

											{/* Document Progress */}
											<div>
												<h4 className="font-medium text-gray-900 mb-2">Documents ({getDocumentCount(app)}/4)</h4>
												<div className="space-y-2">
													<div className="flex items-center justify-between">
														<span className="text-sm text-gray-600">PAN Card</span>
														{app.panImage ? (
															<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														) : (
															<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
															</svg>
														)}
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm text-gray-600">RC Book</span>
														{app.rcImage ? (
															<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														) : (
															<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
															</svg>
														)}
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm text-gray-600">Vehicle Front</span>
														{app.vehicleFrontImage ? (
															<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														) : (
															<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
															</svg>
														)}
													</div>
													<div className="flex items-center justify-between">
														<span className="text-sm text-gray-600">Vehicle Side</span>
														{app.vehicleSideImage ? (
															<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
														) : (
															<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
															</svg>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* Uploaded Images */}
										<div>
											<h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
											<div className="grid grid-cols-2 gap-3">
												{app.panImage && (
													<div className="relative group">
														<img 
															src={app.panImage} 
															alt="PAN Card" 
															className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
															onClick={() => window.open(app.panImage, '_blank')}
														/>
														<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
															<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
															</svg>
														</div>
														<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">P</span>
													</div>
												)}
												{app.rcImage && (
													<div className="relative group">
														<img 
															src={app.rcImage} 
															alt="RC Book" 
															className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
															onClick={() => window.open(app.rcImage, '_blank')}
														/>
														<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
															<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
															</svg>
														</div>
														<span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">R</span>
													</div>
												)}
												{app.vehicleFrontImage && (
													<div className="relative group">
														<img 
															src={app.vehicleFrontImage} 
															alt="Vehicle Front" 
															className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
															onClick={() => window.open(app.vehicleFrontImage, '_blank')}
														/>
														<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
															<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
															</svg>
														</div>
														<span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">F</span>
													</div>
												)}
												{app.vehicleSideImage && (
													<div className="relative group">
														<img 
															src={app.vehicleSideImage} 
															alt="Vehicle Side" 
															className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
															onClick={() => window.open(app.vehicleSideImage, '_blank')}
														/>
														<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
															<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
															</svg>
														</div>
														<span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">S</span>
													</div>
												)}
												{!app.panImage && !app.rcImage && !app.vehicleFrontImage && !app.vehicleSideImage && (
													<div className="col-span-2 text-center py-8 text-gray-500">
														<svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
														</svg>
														<p className="text-sm">No documents uploaded yet</p>
														<Link
															to={`/upload-documents/${app._id}`}
															className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 inline-block"
														>
															Upload Documents
														</Link>
													</div>
												)}
											</div>
										</div>
									</div>

									{/* Delivery Location Section */}
									<div className="mt-6 pt-4 border-t border-gray-200">
										{showDeliveryForm && selectedApplication === app._id ? (
											<DeliveryLocationForm
												applicationId={app._id}
												isEdit={!!editingDelivery}
												onSuccess={handleDeliveryFormSuccess}
												onCancel={handleDeliveryFormCancel}
											/>
										) : (
											<DeliveryLocationDisplay
												applicationId={app._id}
												onEdit={() => handleEditDeliveryLocation(app._id)}
												showEditButton={app.status !== 'rejected'}
											/>
										)}
									</div>

									{/* Action Buttons */}
									<div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
										<div className="flex space-x-3">
											<Link
												to={`/upload-documents/${app._id}`}
												className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
											>
												<svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
												</svg>
												Upload Documents
											</Link>
											<Link
												to={`/status/${app._id}`}
												className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
											>
												<svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
												</svg>
												View Status
											</Link>
											{app.status !== 'rejected' && (
												<button
													onClick={() => handleSetDeliveryLocation(app._id)}
													className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
												>
													<svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
													</svg>
													Set Delivery
												</button>
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						))}
					</div>
				)}

				{/* Document Legend */}
				{applications.length > 0 && (
					<div className="mt-8">
						<Card className="shadow-elegant-lg">
							<CardHeader>
								<div className="flex items-center space-x-3">
									<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>Document Legend</span>
								</div>
							</CardHeader>
							<CardBody>
								<div className="flex flex-wrap gap-6 text-sm text-gray-600">
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
									<div className="text-gray-500 italic">
										💡 Click on any image to view in full size
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}
