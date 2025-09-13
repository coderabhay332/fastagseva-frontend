import { useEffect, useMemo, useState } from 'react';
import { getAllApplications, updateApplicationStatus, deleteApplication, getPaymentsByApplication } from '../services/applications';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../stores';
import { formatDate } from '../utils/dateUtils';
import { deliveryService } from '../services/delivery';

export default function AdminDashboard() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [status, setStatus] = useState<string>('');
	const [search, setSearch] = useState<string>('');
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
	const [paymentData, setPaymentData] = useState<any>(null);
	const [paymentLoading, setPaymentLoading] = useState(false);
	const [deliveries, setDeliveries] = useState<any[]>([]);
	const { user } = useAppSelector(s => s.auth);



	useEffect(() => {
		// Check if user is admin
		if (!user || user.role !== 'ADMIN') {
			setError('Access denied. Admin privileges required.');
			return;
		}

		const load = async () => {
			setLoading(true);
			setError(null);
			setSuccess(null);
			try {
				console.log('Making API call to getAllApplications...');
				const res = await getAllApplications();
				console.log("Full API response:", res);
				console.log("res.data:", res.data);
				console.log("res.data?.data:", res.data?.data);
				console.log("res.data?.data type:", typeof res.data?.data);
				console.log("res.data?.data length:", res.data?.data?.length);
				
				if (res.data?.success && Array.isArray(res.data?.data)) {
					setData(res.data.data);
				} else if (Array.isArray(res.data)) {
					setData(res.data);
				} else {
					console.error('Unexpected response structure:', res.data);
					setError('Unexpected response structure from server');
				}

				// Load delivery information for all applications
				try {
					const deliveryRes = await deliveryService.getUserDeliveries();
					if (deliveryRes.success && deliveryRes.data) {
						setDeliveries(deliveryRes.data);
					}
				} catch (deliveryErr) {
					console.error('Error loading deliveries:', deliveryErr);
					// Don't fail the entire load if deliveries fail
				}
			} catch (err: any) {
				console.error('Error loading applications:', err);
				setError(err?.message || 'Failed to load applications');
			} finally { 
				setLoading(false); 
			}
		};
		load();
	}, [user]);

	// Handle Escape key to close delete modal
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && deleteConfirmId) {
				setDeleteConfirmId(null);
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [deleteConfirmId]);

	const filtered = useMemo(() => {
		let result = data;
		
		// Filter by status
		if (status) {
			result = result.filter(d => d.status === status);
		}
		
		// Filter by search
		if (search) {
			const searchLower = search.toLowerCase();
			result = result.filter(d => 
				d.userId?.name?.toLowerCase().includes(searchLower) ||
				d.userId?.email?.toLowerCase().includes(searchLower) ||
				d.vehicle?.toLowerCase().includes(searchLower) ||
				d._id?.toLowerCase().includes(searchLower) ||
				d.engineNumber?.toLowerCase().includes(searchLower) ||
				d.chasisNumber?.toLowerCase().includes(searchLower)
			);
		}
		
		return result;
	}, [data, status, search]);

	const updateStatus = async (id: string, newStatus: string) => {
		setUpdatingId(id);
		setError(null);
		setSuccess(null);
		try {
			await updateApplicationStatus(id, newStatus);
			setSuccess(`Status updated to ${newStatus}`);
			// Refresh the data
			const res = await getAllApplications();
			setData(res.data?.data || []);
		} catch (err: any) {
			console.error('Error updating status:', err);
			setError(err?.message || 'Failed to update status');
		} finally {
			setUpdatingId(null);
		}
	};

	const loadPaymentDetails = async (applicationId: string, page: number = 1) => {
		setSelectedApplicationId(applicationId);
		setPaymentModalOpen(true);
		setPaymentLoading(true);
		setError(null);
		
		try {
			const res = await getPaymentsByApplication(applicationId, page);
			setPaymentData(res.data?.data || res.data);
		} catch (err: any) {
			console.error('Error loading payment details:', err);
			setError(err?.message || 'Failed to load payment details');
		} finally {
			setPaymentLoading(false);
		}
	};

	const handleDeleteApplication = async (id: string) => {
		setUpdatingId(id);
		setError(null);
		setSuccess(null);
		try {
			await deleteApplication(id);
			setData(prev => prev.filter(p => p._id !== id));
			setSuccess('Application deleted successfully!');
			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			console.error('Error deleting application:', err);
			setError(err?.message || 'Failed to delete application');
			// Clear error message after 5 seconds
			setTimeout(() => setError(null), 5000);
		} finally {
			setUpdatingId(null);
			setDeleteConfirmId(null);
		}
	};

	const statusCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		data.forEach(item => {
			counts[item.status] = (counts[item.status] || 0) + 1;
		});
		return counts;
	}, [data]);

	const allStatuses = ['NOT SUBMITTED', 'PENDING', 'AGENT ASSIGNED', 'REJECTED', 'DONE'];

	const getDeliveryForApplication = (applicationId: string) => {
		return deliveries.find(d => d.orderId === applicationId);
	};

	const updateTrackingNumber = async (deliveryId: string, trackingNumber: string) => {
		try {
			// This would require backend implementation for admin to update tracking
			// For now, we'll just log it
			console.log('Updating tracking number for delivery:', deliveryId, trackingNumber);
			
			// Reload deliveries to get updated data
			const deliveryRes = await deliveryService.getUserDeliveries();
			if (deliveryRes.success && deliveryRes.data) {
				setDeliveries(deliveryRes.data);
			}
		} catch (err) {
			console.error('Error updating tracking:', err);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
							<p className="text-gray-600 text-lg">
								Manage Fastag applications and track progress • {data.length} total applications
								{status && ` • Showing ${filtered.length} ${status.toLowerCase()} applications`}
								{search && ` • Found ${filtered.length} applications matching "${search}"`}
								{status && search && ` • ${filtered.length} results for ${status.toLowerCase()} + "${search}"`}
							</p>
							{user && (
								<p className="text-sm text-gray-500 mt-2">
									Logged in as: {user.email} (Role: {user.role})
								</p>
							)}
						</div>
						<div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-elegant-lg">
							<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
					</div>
				</div>

				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Application Management</h2>
					<p className="text-gray-600">Manage all Fastag applications with delivery information</p>
				</div>

				{/* Status Overview Cards */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
					{allStatuses.map(statusType => (
						<Card key={statusType} className="shadow-elegant hover-lift cursor-pointer transition-elegant" hover>
							<CardBody className="text-center">
								<div className="text-2xl font-bold text-gray-900 mb-1">
									{statusCounts[statusType] || 0}
								</div>
								<StatusBadge status={statusType} />
							</CardBody>
						</Card>
					))}
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

				{/* Main Content */}
				<Card className="shadow-elegant-lg">
					<CardHeader>
						<div className="flex items-center justify-between">
							<span>Application Management</span>
							<div className="flex items-center space-x-4">
								<input
									type="text"
									placeholder="Search applications..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent w-64"
								/>
								{search && (
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => setSearch('')}
										className="flex items-center space-x-2"
									>
										<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
										<span>Clear Search</span>
									</Button>
								)}
								<Button 
									variant="secondary" 
									size="sm" 
									onClick={() => {
										setLoading(true);
										setError(null);
										setSuccess(null);
										getAllApplications().then(res => {
											setData(res.data?.data || []);
										}).catch(err => {
											console.error('Error refreshing:', err);
											setError(err?.message || 'Failed to refresh applications');
										}).finally(() => setLoading(false));
									}}
									disabled={loading}
									className="flex items-center space-x-2"
								>
									<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									<span>Refresh</span>
								</Button>
								<Select 
									value={status} 
									onChange={e => setStatus(e.target.value)} 
									className="w-64"
								>
									<option value="">All Applications ({data.length})</option>
									{allStatuses.map(s => (
										<option key={s} value={s}>
											{s} ({statusCounts[s] || 0})
										</option>
									))}
								</Select>
								{status && (
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => setStatus('')}
										className="flex items-center space-x-2"
									>
										<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
										<span>Clear Filter</span>
									</Button>
								)}
							</div>
						</div>
					</CardHeader>
					<CardBody>
						{/* Filter Summary */}
						{(status || search) && (
							<div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4">
										<span className="text-sm font-medium text-gray-700">Active Filters:</span>
										{status && (
											<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												Status: {status}
												<button
													onClick={() => setStatus('')}
													className="ml-2 text-blue-600 hover:text-blue-800"
												>
													×
												</button>
											</span>
										)}
										{search && (
											<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Search: "{search}"
												<button
													onClick={() => setSearch('')}
													className="ml-2 text-green-600 hover:text-green-800"
												>
													×
												</button>
											</span>
										)}
									</div>
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => {
											setStatus('');
											setSearch('');
										}}
									>
										Clear All Filters
									</Button>
								</div>
							</div>
						)}

						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="flex items-center space-x-3">
									<svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span className="text-gray-600 text-lg">Loading applications...</span>
								</div>
							</div>
						) : error ? (
							<div className="text-center py-12 text-red-600">
								<svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Error: {error}</h3>
								<p className="text-gray-600">
									Failed to load applications. Please try again later.
								</p>
							</div>
						) : filtered.length === 0 ? (
							<div className="text-center py-12">
								<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
								<p className="text-gray-600">
									{status && search 
										? `No applications with status "${status}" matching "${search}"`
										: status 
										? `No applications with status "${status}"`
										: search 
										? `No applications matching "${search}"`
										: 'No applications have been submitted yet.'
									}
								</p>
								{(status || search) && (
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => {
											setStatus('');
											setSearch('');
										}}
										className="mt-4"
									>
										Clear all filters
									</Button>
								)}
							</div>
						) : (
							<div className="overflow-hidden border border-gray-200 rounded-xl">
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													User Information
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Vehicle Details
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Engine Number
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Chassis Number
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Status
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Delivery Address
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Payment
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Submitted
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Last Updated
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Documents
												</th>
												<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{filtered.map((row) => (
												<tr key={row._id} className="hover:bg-gray-50 transition-elegant">
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm font-medium text-gray-900">
															{row.userId?.name || 'Unknown User'}
														</div>
														<div className="text-sm text-gray-500">
															{row.userId?.email || 'No email'}
														</div>
														<div className="text-xs text-gray-400">
															{row.userId?.phone || 'No phone'}
														</div>
														{row.userId?.pancardNumber && (
															<div className="text-xs text-gray-500">PAN: {row.userId.pancardNumber}</div>
														)}
														{!row.userId && (
															<div className="text-xs text-red-500">
																User data not loaded
															</div>
														)}
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm font-medium text-gray-900">{row.vehicle}</div>
														<div className="text-sm text-gray-500">ID: {row._id.slice(-8)}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900 font-mono">{row.engineNumber}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900 font-mono">{row.chasisNumber}</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<StatusBadge status={row.status} />
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														{(() => {
															const delivery = deliveries.find(d => d.orderId === row._id);
															if (!delivery) {
																return (
																	<div className="text-xs text-gray-400 italic">No delivery set</div>
																);
															}
															return (
																<div className="space-y-1">
																	<div className="text-xs font-medium text-gray-900">
																		{delivery.deliveryAddress?.houseNumber}, {delivery.deliveryAddress?.pincode}
																	</div>
																	<div className="text-xs text-gray-600">
																		{delivery.deliveryAddress?.address}
																	</div>
																	{delivery.deliveryAddress?.nearby && (
																		<div className="text-xs text-gray-500">
																			Near: {delivery.deliveryAddress.nearby}
																		</div>
																	)}
																	<div className="text-xs">
																		<span className={`px-2 py-1 rounded-full text-xs font-medium ${
																			delivery.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
																			delivery.deliveryStatus === 'in_transit' ? 'bg-blue-100 text-blue-800' :
																			'bg-yellow-100 text-yellow-800'
																		}`}>
																			{delivery.deliveryStatus === 'delivered' ? 'Delivered' :
																			 delivery.deliveryStatus === 'in_transit' ? 'In Transit' :
																			 'Pending'}
																		</span>
																	</div>
																	{delivery.trackingNumber && (
																		<div className="text-xs text-blue-600 font-mono">
																			📦 {delivery.trackingNumber}
																		</div>
																	)}
																</div>
															);
														})()}
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<Button 
															variant="outline" 
															size="sm" 
															onClick={() => loadPaymentDetails(row._id)}
															className="flex items-center space-x-2"
														>
															<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
															</svg>
															<span>View Payments</span>
														</Button>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900 font-mono">
															{formatDate(row.createdAt)}
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
														{formatDate(row.updatedAt)}
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex space-x-2">
															{row.panImage && (
																<div 
																	className="relative group cursor-pointer"
																	onClick={() => window.open(row.panImage, '_blank')}
																>
																	<img 
																		src={row.panImage} 
																		alt="PAN" 
																		className="w-12 h-12 object-cover rounded border border-gray-200 hover:border-gray-400 transition-colors"
																	/>
																	<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center pointer-events-none">
																		<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
																		</svg>
																	</div>
																	<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">P</span>
																</div>
															)}
															{row.rcImage && (
																<div className="relative group">
																	<img 
																		src={row.rcImage} 
																		alt="RC" 
																		className="w-12 h-12 object-cover rounded border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
																		onClick={() => window.open(row.rcImage, '_blank')}
																	/>
																	<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
																		<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
																		</svg>
																	</div>
																	<span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">R</span>
																</div>
															)}
															{row.vehicleFrontImage && (
																<div className="relative group">
																	<img 
																		src={row.vehicleFrontImage} 
																		alt="Vehicle Front" 
																		className="w-12 h-12 object-cover rounded border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
																		onClick={() => window.open(row.vehicleFrontImage, '_blank')}
																	/>
																	<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
																		<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
																		</svg>
																	</div>
																	<span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">F</span>
																</div>
															)}
															{row.vehicleSideImage && (
																<div className="relative group">
																	<img 
																		src={row.vehicleSideImage} 
																		alt="Vehicle Side" 
																		className="w-12 h-12 object-cover rounded border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
																		onClick={() => window.open(row.vehicleSideImage, '_blank')}
																	/>
																	<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
																		<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
																			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
																		</svg>
																	</div>
																	<span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">S</span>
																</div>
															)}
															{!row.panImage && !row.rcImage && !row.vehicleFrontImage && !row.vehicleSideImage && (
																<div className="text-xs text-gray-400 italic">No documents</div>
															)}
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex flex-col space-y-2">
															{row.status === 'PENDING' && (
																<Button 
																	variant="primary" 
																	size="sm" 
																	onClick={() => updateStatus(row._id, 'AGENT ASSIGNED')}
																	loading={updatingId === row._id}
																	disabled={updatingId === row._id}
																	className="w-full"
																>
																	{updatingId === row._id ? 'Updating...' : 'Assign Agent'}
																</Button>
															)}
															{row.status === 'AGENT ASSIGNED' && (
																<Button 
																	variant="primary" 
																	size="sm" 
																	onClick={() => updateStatus(row._id, 'DONE')}
																	loading={updatingId === row._id}
																	disabled={updatingId === row._id}
																	className="w-full"
																>
																	{updatingId === row._id ? 'Updating...' : 'Mark Done'}
																</Button>
															)}
															{row.status === 'PENDING' && (
																<Button 
																	variant="danger" 
																	size="sm" 
																	onClick={() => updateStatus(row._id, 'REJECTED')}
																	loading={updatingId === row._id}
																	disabled={updatingId === row._id}
																	className="w-full"
																>
																	{updatingId === row._id ? 'Updating...' : 'Reject'}
																</Button>
															)}
															<Button 
																variant="danger" 
																size="sm" 
																onClick={() => setDeleteConfirmId(row._id)}
																disabled={updatingId === row._id}
																loading={updatingId === row._id}
																className="w-full flex items-center justify-center space-x-2"
															>
																<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
																</svg>
																<span>{updatingId === row._id ? 'Deleting...' : 'Delete'}</span>
															</Button>
															<Link 
																to={`/details/${row._id}`} 
																className="text-blue-600 hover:underline text-sm px-2 py-1 text-center"
															>
																View Details
															</Link>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* Document Legend */}
						<div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
							<h4 className="text-sm font-medium text-gray-700 mb-3">Document Legend</h4>
							<div className="flex flex-wrap gap-4 text-xs text-gray-600">
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
						</div>

						{/* Agent Contact Info */}
						<div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
							<div className="flex items-start space-x-3">
								<svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								<div>
									<h4 className="font-medium text-blue-900 mb-2">Field Agent Contact Information</h4>
									<div className="text-sm text-blue-800 space-y-1">
										<p>📧 Email: savsuresh20@gmail.com</p>
										<p>📱 Phone: +91 82867 06594</p>
										<p className="text-xs text-blue-600 mt-2">
											This agent will handle installations for approved applications.
										</p>
									</div>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>

		</div>

			{/* Payment Details Modal */}
			{paymentModalOpen && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					onClick={() => setPaymentModalOpen(false)}
				>
					<div 
						className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
									<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
									</svg>
								</div>
								<h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
							</div>
							<button
								onClick={() => setPaymentModalOpen(false)}
								className="text-gray-400 hover:text-gray-600 transition-colors"
							>
								<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{paymentLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
								<span className="ml-2 text-gray-600">Loading payment details...</span>
							</div>
						) : paymentData ? (
							<div className="space-y-6">
								{/* Payment Summary */}
								<div className="bg-gray-50 rounded-lg p-4">
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div>
											<span className="text-gray-500">Total Payments:</span>
											<p className="font-medium">{paymentData.pagination?.totalCount || 0}</p>
										</div>
										<div>
											<span className="text-gray-500">Total Amount:</span>
											<p className="font-medium">₹{paymentData.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0}</p>
										</div>
										<div>
											<span className="text-gray-500">Successful Payments:</span>
											<p className="font-medium text-green-600">{paymentData.payments?.filter((p: any) => p.paymentStatus === 'PAID').length || 0}</p>
										</div>
										<div>
											<span className="text-gray-500">Pending Payments:</span>
											<p className="font-medium text-orange-600">{paymentData.payments?.filter((p: any) => p.paymentStatus !== 'PAID').length || 0}</p>
										</div>
									</div>
								</div>

								{/* Payment List */}
								{paymentData.payments && paymentData.payments.length > 0 ? (
									<div className="overflow-hidden border border-gray-200 rounded-lg">
										<table className="min-w-full divide-y divide-gray-200">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
													<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{paymentData.payments.map((payment: any) => (
													<tr key={payment._id} className="hover:bg-gray-50">
														<td className="px-4 py-3 whitespace-nowrap">
															<div className="text-sm font-medium text-gray-900">₹{payment.amount}</div>
														</td>
														<td className="px-4 py-3 whitespace-nowrap">
															<div className="text-sm text-gray-900">{payment.customerName}</div>
															<div className="text-sm text-gray-500">{payment.customerEmail}</div>
															<div className="text-xs text-gray-400">{payment.customerPhone}</div>
														</td>
														<td className="px-4 py-3 whitespace-nowrap">
															<div className="text-sm text-gray-900">{payment.bankName || '-'}</div>
														</td>
														<td className="px-4 py-3 whitespace-nowrap">
															<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
																payment.paymentStatus === 'PAID' 
																	? 'bg-green-100 text-green-800' 
																	: payment.paymentStatus === 'FAILED'
																	? 'bg-red-100 text-red-800'
																	: 'bg-yellow-100 text-yellow-800'
															}`}>
																{payment.paymentStatus}
															</span>
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
															{formatDate(payment.createdAt)}
														</td>
														<td className="px-4 py-3 whitespace-nowrap">
															<div className="text-sm font-mono text-gray-900">{payment.orderId}</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<div className="text-center py-8">
										<svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
										</svg>
										<p className="text-gray-500">No payments found for this application</p>
									</div>
								)}

								{/* Pagination */}
								{paymentData.pagination && paymentData.pagination.totalPages > 1 && (
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-700">
											Showing page {paymentData.pagination.currentPage} of {paymentData.pagination.totalPages}
										</div>
										<div className="flex space-x-2">
											{paymentData.pagination.hasPrevPage && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => loadPaymentDetails(selectedApplicationId!, paymentData.pagination.prevPage)}
												>
													Previous
												</Button>
											)}
											{paymentData.pagination.hasNextPage && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => loadPaymentDetails(selectedApplicationId!, paymentData.pagination.nextPage)}
												>
													Next
												</Button>
											)}
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="text-center py-8">
								<p className="text-gray-500">Failed to load payment details</p>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deleteConfirmId && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					onClick={() => setDeleteConfirmId(null)}
				>
					<div 
						className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
								<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							<h3 className="text-lg font-medium text-gray-900">Delete Application</h3>
						</div>
						{(() => {
							const appToDelete = data.find(app => app._id === deleteConfirmId);
							return (
								<>
									<p className="text-gray-600 mb-4">
										Are you sure you want to delete this application? This action cannot be undone and will permanently remove the application and all associated data.
									</p>
									{appToDelete && (
										<div className="bg-gray-50 rounded-lg p-3 mb-6">
											<p className="text-sm text-gray-700">
												<strong>Vehicle:</strong> {appToDelete.vehicle}
											</p>
											<p className="text-sm text-gray-700">
												<strong>User:</strong> {appToDelete.userId?.name || 'Unknown User'}
											</p>
											<p className="text-sm text-gray-700">
												<strong>Status:</strong> {appToDelete.status}
											</p>
										</div>
									)}
								</>
							);
						})()}
						<div className="flex space-x-3">
							<Button
								variant="secondary"
								onClick={() => setDeleteConfirmId(null)}
								disabled={updatingId === deleteConfirmId}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								variant="danger"
								onClick={() => handleDeleteApplication(deleteConfirmId)}
								loading={updatingId === deleteConfirmId}
								disabled={updatingId === deleteConfirmId}
								className="flex-1"
							>
								{updatingId === deleteConfirmId ? 'Deleting...' : 'Delete Application'}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}