import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../stores';
import { uploadFileThunk } from '../stores/slices/applicationSlice';
import Card, { CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FileUploader from '../components/FileUploader';

const documentTypes = [
	{
		key: 'pan',
		label: 'PAN Card',
		description: 'Upload clear photo of your PAN card',
		icon: '📄',
		accept: 'image/*,.pdf'
	},
	{
		key: 'rc',
		label: 'Registration Certificate (RC)',
		description: 'Vehicle registration certificate',
		icon: '📋',
		accept: 'image/*,.pdf'
	},
	{
		key: 'vehicle-front',
		label: 'Vehicle Front Photo',
		description: 'Clear front view of your vehicle',
		icon: '🚗',
		accept: 'image/*'
	},
	{
		key: 'vehicle-side',
		label: 'Vehicle Side Photo',
		description: 'Side view showing number plate',
		icon: '📸',
		accept: 'image/*'
	}
];

export default function VehicleDetails() {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const app = useAppSelector(s => s.application);
	const navigate = useNavigate();
	
	const [files, setFiles] = useState<Record<string, File | null>>({
		pan: null,
		rc: null,
		'vehicle-front': null,
		'vehicle-side': null
	});

	const [uploading, setUploading] = useState(false);

	const handleFileChange = (type: string) => (file: File | null) => {
		setFiles(prev => ({ ...prev, [type]: file }));
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		
		setUploading(true);
		try {
			const uploads: Array<Promise<any>> = [];
			Object.entries(files).forEach(([type, file]) => {
				if (file) {
					uploads.push(dispatch(uploadFileThunk({ 
						id, 
						type: type as 'pan' | 'rc' | 'vehicle-front' | 'vehicle-side', 
						file 
					})) as any);
				}
			});
			
			if (uploads.length > 0) {
				await Promise.all(uploads);
			}
			
			navigate(`/status/${id}`);
		} finally {
			setUploading(false);
		}
	};

	const uploadedCount = Object.values(files).filter(Boolean).length;
	const progressPercentage = (uploadedCount / documentTypes.length) * 100;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold gradient-text mb-2">Document Upload</h1>
					<p className="text-gray-600 text-lg">Upload required documents to complete your application</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Upload Form */}
					<div className="lg:col-span-2">
						<Card className="shadow-elegant-lg">
							<CardHeader>
								Required Documents
								<div className="mt-4">
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div 
											className="bg-gray-900 h-2 rounded-full transition-all duration-500 ease-out" 
											style={{ width: `${progressPercentage}%` }}
										></div>
									</div>
									<p className="text-sm text-gray-600 mt-2">
										{uploadedCount} of {documentTypes.length} documents selected
									</p>
								</div>
							</CardHeader>
							<CardBody>
								<form onSubmit={onSubmit} className="space-y-8">
									{documentTypes.map((doc) => (
										<div key={doc.key} className="bg-gray-50 rounded-xl p-6">
											<div className="flex items-start space-x-4 mb-4">
												<div className="text-3xl">{doc.icon}</div>
												<div className="flex-1">
													<h3 className="text-lg font-semibold text-gray-900">{doc.label}</h3>
													<p className="text-gray-600 text-sm">{doc.description}</p>
												</div>
											</div>
											<FileUploader
												label={`Upload ${doc.label}`}
												accept={doc.accept}
												onChange={handleFileChange(doc.key)}
											/>
											{files[doc.key] && (
												<div className="mt-2 text-sm text-green-600 flex items-center">
													<svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
													</svg>
													{files[doc.key]?.name}
												</div>
											)}
										</div>
									))}
								</form>
							</CardBody>
							<CardFooter>
								<Button 
									onClick={onSubmit}
									loading={uploading}
									className="w-full"
									size="lg"
									disabled={uploadedCount === 0}
								>
									{uploading ? 'Uploading Documents...' : 'Submit Application'}
								</Button>
								
								{app.error && (
									<div className="mt-4">
										<p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
											{app.error}
										</p>
									</div>
								)}
							</CardFooter>
						</Card>
					</div>

					{/* Upload Guidelines */}
					<div className="lg:col-span-1">
						<Card className="shadow-elegant-lg sticky top-24">
							<CardHeader>
								Upload Guidelines
							</CardHeader>
							<CardBody className="space-y-6">
								<div className="space-y-4">
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
										<h4 className="font-medium text-blue-900 mb-2">📋 Document Requirements</h4>
										<ul className="text-sm text-blue-800 space-y-1">
											<li>• Clear, readable images</li>
											<li>• All four corners visible</li>
											<li>• Maximum 10MB per file</li>
											<li>• JPG, PNG, or PDF format</li>
										</ul>
									</div>

									<div className="bg-green-50 border border-green-200 rounded-lg p-4">
										<h4 className="font-medium text-green-900 mb-2">✅ Photo Tips</h4>
										<ul className="text-sm text-green-800 space-y-1">
											<li>• Use good lighting</li>
											<li>• Avoid shadows and glare</li>
											<li>• Keep documents flat</li>
											<li>• Take photos straight-on</li>
										</ul>
									</div>

									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
										<h4 className="font-medium text-yellow-900 mb-2">⚠️ Important</h4>
										<ul className="text-sm text-yellow-800 space-y-1">
											<li>• Ensure all text is readable</li>
											<li>• Vehicle photos must show number plate</li>
											<li>• Documents must be valid and current</li>
										</ul>
									</div>
								</div>

								<div className="text-center pt-4">
									<p className="text-xs text-gray-500">
										All uploaded documents are encrypted and secure
									</p>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}