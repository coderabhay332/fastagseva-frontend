import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../stores';
import { createApplicationThunk } from '../stores/slices/applicationSlice';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ProfileCompletionCheck from '../components/ProfileCompletionCheck';

function CreateApplicationForm() {
	const dispatch = useAppDispatch();
	const app = useAppSelector(s => s.application);
	const navigate = useNavigate();
	const [vehicle, setVehicle] = useState('');
	const [engineNumber, setEngineNumber] = useState('');
	const [chasisNumber, setChasisNumber] = useState('');

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await dispatch(createApplicationThunk({ vehicle, engineNumber, chasisNumber }));
		if ((res as any).type?.endsWith('fulfilled')) {
			const id = (res as any).payload?._id;
			navigate(`/payment/${id}`);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-2xl mx-auto px-4">
				{/* Header Section */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold gradient-text mb-2">Create Fastag Application</h1>
					<p className="text-gray-600 text-lg">Enter your vehicle details to get started</p>
				</div>

				<Card className="shadow-elegant-lg">
					<CardHeader>
						Vehicle Information
					</CardHeader>
					<CardBody>
						<form onSubmit={onSubmit} className="space-y-6">
							<Input 
								label="Vehicle Number"
								placeholder="e.g., MH01AB1234" 
								value={vehicle} 
								onChange={e => setVehicle(e.target.value.toUpperCase())}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
									</svg>
								}
								required
							/>
							
							<Input 
								label="Engine Number"
								placeholder="Enter engine number" 
								value={engineNumber} 
								onChange={e => setEngineNumber(e.target.value)}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								}
								required
							/>
							
							<Input 
								label="Chassis Number"
								placeholder="Enter chassis number" 
								value={chasisNumber} 
								onChange={e => setChasisNumber(e.target.value)}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								}
								required
							/>
							
							<div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
								<div className="flex items-start space-x-3">
									<svg className="h-5 w-5 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<div className="text-sm text-gray-600">
										<p className="font-medium mb-1">Important Information:</p>
										<ul className="space-y-1 list-disc list-inside">
											<li>Ensure all details match your vehicle registration certificate</li>
											<li>Double-check engine and chassis numbers for accuracy</li>
											<li>Application processing may take 2-3 business days</li>
										</ul>
									</div>
								</div>
							</div>

							<Button 
								className="w-full" 
								loading={app.loading}
								type="submit"
								size="lg"
							>
								Proceed to Payment
							</Button>

							{app.error && (
								<div className="text-center">
									<p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
										{app.error}
									</p>
								</div>
							)}
						</form>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

export default function CreateApplication() {
	return (
		<ProfileCompletionCheck>
			<CreateApplicationForm />
		</ProfileCompletionCheck>
	);
}