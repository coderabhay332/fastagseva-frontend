import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../stores';
import { createPaymentThunk } from '../stores/slices/paymentSlice';
import Card, { CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PaymentOptionCard from '../components/PaymentOptionCard';
import { profileService } from '../services/profile';

const BANK_PRICING: Record<string, number> = {
	SBI: 400,
	IDFC: 500,
	LivQuick: 400,
	Bajaj: 500,
};

export default function Payment() {
	const { id: applicationId } = useParams();
	const dispatch = useAppDispatch();
	const payment = useAppSelector(s => s.payment);
	const { user } = useAppSelector(s => s.auth);
	const navigate = useNavigate();

	const [bank, setBank] = useState<string>('SBI');
	const [profilePhone, setProfilePhone] = useState<string>('');
	const price = useMemo(() => BANK_PRICING[bank], [bank]);

	useEffect(() => {
		(async () => {
			try {
				const res = await profileService.getProfile();
				setProfilePhone(res?.data?.phone || '');
			} catch {}
		})();
	}, []);

	const onPay = async () => {
		if (!applicationId) {
			alert('Application ID is missing');
			return;	
		}

		if (!user) {
			alert('User not authenticated');
			return;
		}

		const phone = (profilePhone || '').trim();
		const isTenDigits = /^\d{10}$/.test(phone);
		const allSameDigit = /^(\d)\1{9}$/.test(phone);
		if (!isTenDigits || allSameDigit) {
			alert('Please add a valid 10-digit mobile number in your profile (not repeating digits like 9999999999), then try again.');
			return;
		}

		const res = await dispatch(
			createPaymentThunk({ 
				amount: price, 
				customerName: user?.name || 'Customer', 
				customerEmail: user.email || 'email@example.com', 
				customerPhone: phone,
				applicationId: applicationId,
				bankName: bank
			})
		);
		
		if ((res as any).type?.endsWith('fulfilled')) {
			const paymentUrl = (res as any).payload?.data?.paymentUrl;
			if (paymentUrl) {
				window.location.href = paymentUrl;
				return;
			}
			navigate(`/upload-documents/${applicationId}`);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Progress Bar */}
				<div className="mb-8">
					<div className="flex items-center justify-center space-x-4">
						<div className="flex items-center">
							<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
								<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<span className="ml-2 text-sm font-medium text-green-600">1 Personal Details</span>
						</div>
						<div className="w-16 h-0.5 bg-blue-500"></div>
						<div className="flex items-center">
							<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
								<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
								</svg>
							</div>
							<span className="ml-2 text-sm font-medium text-blue-600">2 Payment</span>
						</div>
						<div className="w-16 h-0.5 bg-gray-300"></div>
						<div className="flex items-center">
							<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
								<svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<span className="ml-2 text-sm font-medium text-gray-500">3 Vehicle Details</span>
						</div>
					</div>
				</div>

				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold gradient-text mb-2">Payment Options</h1>
					<p className="text-gray-600 text-lg">Choose your preferred payment method</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Payment Selection */}
					<div className="lg:col-span-2">
						<Card className="shadow-elegant-lg">
							<CardHeader>
								Select Payment Method
							</CardHeader>
							<CardBody className="space-y-6">
								{/* Vehicle Type Display */}
								<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
									<div className="flex items-center space-x-3">
										<svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
										</svg>
										<div>
											<p className="font-medium text-blue-900">4 Wheeler Application</p>
											<p className="text-sm text-blue-700">Car, SUV, Truck</p>
										</div>
									</div>
								</div>

								{/* Bank Selection */}
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Banking Partner</h3>
									<div className="grid gap-4">
										{Object.keys(BANK_PRICING).map(b => (
											<PaymentOptionCard 
												key={b} 
												bank={b} 
												price={BANK_PRICING[b]} 
												selected={bank === b} 
												onSelect={() => setBank(b)} 
											/>
										))}
									</div>
								</div>
							</CardBody>
						</Card>
					</div>

					{/* Payment Summary */}
					<div className="lg:col-span-1">
						<Card className="shadow-elegant-lg sticky top-24">
							<CardHeader>
								Payment Summary
							</CardHeader>
							<CardBody className="space-y-4">
								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Vehicle Type:</span>
										<span className="font-medium">4 Wheeler</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Bank Partner:</span>
										<span className="font-medium">{bank}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Processing Fee:</span>
										<span className="font-medium">₹{price}</span>
									</div>
									<div className="border-t pt-3">
										<div className="flex justify-between text-lg font-bold">
											<span>Total Amount:</span>
											<span className="text-2xl">₹{price}</span>
										</div>
									</div>
								</div>

								{/* Features List */}
								<div className="bg-gray-50 rounded-lg p-4">
									<h4 className="font-medium text-gray-900 mb-2">What's Included:</h4>
									<ul className="text-sm text-gray-600 space-y-1">
										<li className="flex items-center">
											<svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											Fastag Device
										</li>
										<li className="flex items-center">
											<svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											Installation Support
										</li>
										<li className="flex items-center">
											<svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											Documentation Processing
										</li>
									</ul>
								</div>
							</CardBody>
							<CardFooter>
								<Button 
									variant="primary" 
									onClick={onPay} 
									loading={payment.loading}
									className="w-full"
									size="lg"
								>
									Proceed to Pay ₹{price}
								</Button>
								
								{payment.error && (
									<div className="mt-4">
										<p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
											{payment.error}
										</p>
									</div>
								)}
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}