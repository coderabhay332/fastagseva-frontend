import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../stores';
import { signupThunk } from '../stores/slices/authSlice';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface FormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface FormErrors {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

export default function Signup() {
	const dispatch = useAppDispatch();
	const auth = useAppSelector(s => s.auth);
	const navigate = useNavigate();
	const location = useLocation();
	const from = (location.state as any)?.from?.pathname || '/';

	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const [formErrors, setFormErrors] = useState<FormErrors>({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	if (auth.accessToken) {
		return <Navigate to={from} replace />;
	}

	const validateForm = (): boolean => {
		const errors: FormErrors = {};

		// Name validation
		if (!formData.name.trim()) {
			errors.name = 'Name is required';
		} else if (typeof formData.name !== 'string') {
			errors.name = 'Name must be a string';
		}

		// Email validation
		if (!formData.email.trim()) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = 'Email must be valid';
		}

		// Password validation
		if (!formData.password) {
			errors.password = 'Password is required';
		} else if (typeof formData.password !== 'string') {
			errors.password = 'Password must be a string';
		} else if (formData.password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
		}

		// Confirm password validation
		if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = 'Password confirmation does not match password';
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (formErrors[field]) {
			setFormErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		const res = await dispatch(signupThunk(formData));
		if ((res as any).type?.endsWith('fulfilled')) {
			// Navigate after a short delay to show success message
			setTimeout(() => {
				navigate(from, { replace: true });
			}, 2000);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
			<div className="w-full max-w-md">
				{/* Welcome Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<span className="text-white text-2xl font-bold">F</span>
					</div>
					<h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
					<p className="text-gray-600">Join Fastag and get started with your applications</p>
				</div>

				<Card className="shadow-elegant-lg">
					<CardHeader className="text-center">
						Sign Up to Continue
					</CardHeader>
					
					{/* Success Message */}
					{auth.success && (
						<div className="mx-6 mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
							<div className="flex items-center space-x-3">
								<svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span className="text-green-800 font-medium">{auth.success}</span>
							</div>
						</div>
					)}
					
					<CardBody>
						<form onSubmit={onSubmit} className="space-y-6">
							<Input 
								label="Full Name"
								placeholder="Enter your full name" 
								type="text" 
								value={formData.name} 
								onChange={e => handleInputChange('name', e.target.value)}
								error={formErrors.name}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								}
								required
							/>
							
							<Input 
								label="Email Address"
								placeholder="Enter your email" 
								type="email" 
								value={formData.email} 
								onChange={e => handleInputChange('email', e.target.value)}
								error={formErrors.email}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
									</svg>
								}
								required
							/>
							
							<Input 
								label="Password"
								placeholder="Create a password" 
								type={showPassword ? "text" : "password"}
								value={formData.password} 
								onChange={e => handleInputChange('password', e.target.value)}
								error={formErrors.password}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								}
								required
								rightIcon={
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="text-gray-400 hover:text-gray-600 transition-colors"
									>
										{showPassword ? (
											<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
											</svg>
										) : (
											<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								}
							/>
							
							<Input 
								label="Confirm Password"
								placeholder="Confirm your password" 
								type={showConfirmPassword ? "text" : "password"}
								value={formData.confirmPassword} 
								onChange={e => handleInputChange('confirmPassword', e.target.value)}
								error={formErrors.confirmPassword}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								}
								required
								rightIcon={
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="text-gray-400 hover:text-gray-600 transition-colors"
									>
										{showConfirmPassword ? (
											<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
											</svg>
										) : (
											<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								}
							/>
							
							<Button 
								className="w-full" 
								loading={auth.loading}
								type="submit"
							>
								Create Account
							</Button>

							{auth.error && (
								<div className="text-center">
									<p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
										{auth.error}
									</p>
								</div>
							)}
						</form>
					</CardBody>
				</Card>

				<div className="text-center mt-6">
					<p className="text-gray-500 text-sm">
						Already have an account? <a href="/login" className="text-gray-900 font-medium hover:underline">Sign in</a>
					</p>
				</div>

				{/* Password Requirements */}
				<div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
					<h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements</h4>
					<ul className="text-xs text-blue-800 space-y-1">
						<li>• At least 6 characters long</li>
						<li>• Must be a valid string</li>
						<li>• Confirm password must match</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
