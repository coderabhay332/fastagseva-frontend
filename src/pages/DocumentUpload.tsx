import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '../stores';
import { uploadPan, uploadRc, uploadVehicleFront, uploadVehicleSide, listMyPayments } from '../services/applications';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';

interface UploadState {
	pan: { file: File | null; loading: boolean; uploaded: boolean; url?: string };
	rc: { file: File | null; loading: boolean; uploaded: boolean; url?: string };
	vehicleFront: { file: File | null; loading: boolean; uploaded: boolean; url?: string };
	vehicleSide: { file: File | null; loading: boolean; uploaded: boolean; url?: string };
}

export default function DocumentUpload() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAppSelector(s => s.auth);
	const [uploadState, setUploadState] = useState<UploadState>({
		pan: { file: null, loading: false, uploaded: false },
		rc: { file: null, loading: false, uploaded: false },
		vehicleFront: { file: null, loading: false, uploaded: false },
		vehicleSide: { file: null, loading: false, uploaded: false }
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [paid, setPaid] = useState<boolean>(false);

	useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}
		(async () => {
			try {
				const res = await listMyPayments(1, 100);
				const payments = res.data?.data?.payments || res.data?.payments || [];
				const isPaid = payments.some((p: any) => p.applicationId === id && p.paymentStatus === 'PAID');
				setPaid(isPaid);
			} catch {}
		})();
	}, [user, navigate, id]);

	const handleFileSelect = (type: keyof UploadState, file: File) => {
		setUploadState(prev => ({
			...prev,
			[type]: { ...prev[type], file, uploaded: false }
		}));
		setError(null);
	};

	const uploadFile = async (type: keyof UploadState) => {
		if (!paid) {
			setError('Please complete the payment before uploading documents.');
			return;
		}
		const currentState = uploadState[type];
		if (!currentState.file) return;

		setUploadState(prev => ({
			...prev,
			[type]: { ...prev[type], loading: true }
		}));

		try {
			let result: any;
			switch (type) {
				case 'pan':
					result = await uploadPan(id!, currentState.file);
					break;
				case 'rc':
					result = await uploadRc(id!, currentState.file);
					break;
				case 'vehicleFront':
					result = await uploadVehicleFront(id!, currentState.file);
					break;
				case 'vehicleSide':
					result = await uploadVehicleSide(id!, currentState.file);
					break;
			}

			setUploadState(prev => ({
				...prev,
				[type]: { 
					...prev[type], 
					loading: false, 
					uploaded: true, 
					url: result?.data?.data?.url || result?.data?.url 
				}
			}));

			setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			setUploadState(prev => ({
				...prev,
				[type]: { ...prev[type], loading: false }
			}));
			setError(`Failed to upload ${type}: ${err?.message || 'Unknown error'}`);
			setTimeout(() => setError(null), 5000);
		}
	};

	const getUploadProgress = () => {
		const total = Object.keys(uploadState).length;
		const completed = Object.values(uploadState).filter(state => state.uploaded).length;
		return Math.round((completed / total) * 100);
	};

	const allUploaded = Object.values(uploadState).every(state => state.uploaded);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold gradient-text mb-2">Upload Documents</h1>
					<p className="text-gray-600 text-lg">{paid ? 'Payment verified. You can upload your documents.' : 'Complete your payment to start uploading documents.'}</p>
					{!paid && (
						<div className="mt-4">
							<Link
								to={`/payment/${id}`}
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
							>
								Complete Payment
							</Link>
						</div>
					)}
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

				{/* Uploads are disabled until paid */}
				{!paid && (
					<div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
						<div className="text-yellow-800 text-sm">Please complete the payment to enable uploads.</div>
					</div>
				)}

				<div className="grid lg:grid-cols-2 gap-6">
					{/* PAN Card Upload */}
					<Card className="shadow-elegant-lg">
						<CardHeader>
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
									<span className="text-blue-600 font-bold text-sm">P</span>
								</div>
								<span>PAN Card</span>
								{uploadState.pan.uploaded && (
									<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								)}
							</div>
						</CardHeader>
						<CardBody>
							<div className="space-y-4">
								{uploadState.pan.uploaded && uploadState.pan.url ? (
									<div className="text-center">
										<img 
											src={uploadState.pan.url} 
											alt="PAN Card" 
											className="w-32 h-20 object-cover rounded-lg border border-gray-200 mx-auto"
										/>
										<p className="text-sm text-green-600 mt-2">✓ Uploaded successfully</p>
									</div>
								) : (
									<>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => e.target.files?.[0] && handleFileSelect('pan', e.target.files[0])}
											className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
										/>
										{uploadState.pan.file && (
											<Button
												onClick={() => uploadFile('pan')}
												loading={uploadState.pan.loading}
												disabled={uploadState.pan.loading}
												className="w-full"
											>
												{uploadState.pan.loading ? 'Uploading...' : 'Upload PAN Card'}
											</Button>
										)}
									</>
								)}
							</div>
						</CardBody>
					</Card>

					{/* RC Book Upload */}
					<Card className="shadow-elegant-lg">
						<CardHeader>
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
									<span className="text-green-600 font-bold text-sm">R</span>
								</div>
								<span>RC Book</span>
								{uploadState.rc.uploaded && (
									<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								)}
							</div>
						</CardHeader>
						<CardBody>
							<div className="space-y-4">
								{uploadState.rc.uploaded && uploadState.rc.url ? (
									<div className="text-center">
										<img 
											src={uploadState.rc.url} 
											alt="RC Book" 
											className="w-32 h-20 object-cover rounded-lg border border-gray-200 mx-auto"
										/>
										<p className="text-sm text-green-600 mt-2">✓ Uploaded successfully</p>
									</div>
								) : (
									<>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => e.target.files?.[0] && handleFileSelect('rc', e.target.files[0])}
											className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
										/>
										{uploadState.rc.file && (
											<Button
												onClick={() => uploadFile('rc')}
												loading={uploadState.rc.loading}
												disabled={uploadState.rc.loading}
												className="w-full"
											>
												{uploadState.rc.loading ? 'Uploading...' : 'Upload RC Book'}
											</Button>
										)}
									</>
								)}
							</div>
						</CardBody>
					</Card>

					{/* Vehicle Front Image Upload */}
					<Card className="shadow-elegant-lg">
						<CardHeader>
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
									<span className="text-purple-600 font-bold text-sm">F</span>
								</div>
								<span>Vehicle Front</span>
								{uploadState.vehicleFront.uploaded && (
									<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								)}
							</div>
						</CardHeader>
						<CardBody>
							<div className="space-y-4">
								{uploadState.vehicleFront.uploaded && uploadState.vehicleFront.url ? (
									<div className="text-center">
										<img 
											src={uploadState.vehicleFront.url} 
											alt="Vehicle Front" 
											className="w-32 h-20 object-cover rounded-lg border border-gray-200 mx-auto"
										/>
										<p className="text-sm text-green-600 mt-2">✓ Uploaded successfully</p>
									</div>
								) : (
									<>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => e.target.files?.[0] && handleFileSelect('vehicleFront', e.target.files[0])}
											className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
										/>
										{uploadState.vehicleFront.file && (
											<Button
												onClick={() => uploadFile('vehicleFront')}
												loading={uploadState.vehicleFront.loading}
												disabled={uploadState.vehicleFront.loading}
												className="w-full"
											>
												{uploadState.vehicleFront.loading ? 'Uploading...' : 'Upload Vehicle Front'}
											</Button>
										)}
									</>
								)}
							</div>
						</CardBody>
					</Card>

					{/* Vehicle Side Image Upload */}
					<Card className="shadow-elegant-lg">
						<CardHeader>
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
									<span className="text-orange-600 font-bold text-sm">S</span>
								</div>
								<span>Vehicle Side</span>
								{uploadState.vehicleSide.uploaded && (
									<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								)}
							</div>
						</CardHeader>
						<CardBody>
							<div className="space-y-4">
								{uploadState.vehicleSide.uploaded && uploadState.vehicleSide.url ? (
									<div className="text-center">
										<img 
											src={uploadState.vehicleSide.url} 
											alt="Vehicle Side" 
											className="w-32 h-20 object-cover rounded-lg border border-gray-200 mx-auto"
										/>
										<p className="text-sm text-green-600 mt-2">✓ Uploaded successfully</p>
									</div>
								) : (
									<>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => e.target.files?.[0] && handleFileSelect('vehicleSide', e.target.files[0])}
											className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
										/>
										{uploadState.vehicleSide.file && (
											<Button
												onClick={() => uploadFile('vehicleSide')}
												loading={uploadState.vehicleSide.loading}
												disabled={uploadState.vehicleSide.loading}
												className="w-full"
											>
												{uploadState.vehicleSide.loading ? 'Uploading...' : 'Upload Vehicle Side'}
											</Button>
										)}
									</>
								)}
							</div>
						</CardBody>
					</Card>
				</div>

				{/* Completion Section */}
				{allUploaded && (
					<div className="mt-8 text-center">
						<Card className="shadow-elegant-lg bg-green-50 border-green-200">
							<CardBody>
								<div className="flex items-center justify-center space-x-3 mb-4">
									<svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="text-2xl font-bold text-green-800 mb-2">All Documents Uploaded!</h3>
								<p className="text-green-700 mb-6">
									Your Fastag application is now complete. We'll review your documents and process your application.
								</p>
								<div className="space-x-4">
									<Button
										variant="secondary"
										onClick={() => navigate('/my-application')}
									>
										View My Applications
									</Button>
									<Button
										onClick={() => navigate('/')}
									>
										Create Another Application
									</Button>
								</div>
							</CardBody>
						</Card>
					</div>
				)}

				{/* Help Section */}
				<div className="mt-8">
					<Card className="shadow-elegant-lg">
						<CardHeader>
							<div className="flex items-center space-x-3">
								<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span>Document Requirements</span>
							</div>
						</CardHeader>
						<CardBody>
							<div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
								<div>
									<h4 className="font-medium text-gray-900 mb-2">Required Documents:</h4>
									<ul className="space-y-1 list-disc list-inside">
										<li><strong>PAN Card:</strong> Clear image of your PAN card</li>
										<li><strong>RC Book:</strong> Vehicle registration certificate</li>
										<li><strong>Vehicle Front:</strong> Clear front view of your vehicle</li>
										<li><strong>Vehicle Side:</strong> Side view showing vehicle details</li>
									</ul>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-2">Upload Guidelines:</h4>
									<ul className="space-y-1 list-disc list-inside">
										<li>Use high-quality images (JPG, PNG)</li>
										<li>Ensure all text is clearly readable</li>
										<li>Good lighting and no shadows</li>
										<li>Maximum file size: 5MB per image</li>
									</ul>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
