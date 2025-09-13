import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../stores';
import { loginThunk } from '../stores/slices/authSlice';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
	const dispatch = useAppDispatch();
	const auth = useAppSelector(s => s.auth);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const from = (location.state as any)?.from?.pathname || '/';

	if (auth.accessToken) {
		return <Navigate to={from} replace />;
	}

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await dispatch(loginThunk({ email, password }));
		if ((res as any).type?.endsWith('fulfilled')) {
			navigate(from, { replace: true });
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
			<div className="w-full max-w-md">
				{/* Welcome Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<span className="text-white text-2xl font-bold">F</span>
					</div>
					<h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
					<p className="text-gray-600">Sign in to your Fastag account</p>
				</div>

				<Card className="shadow-elegant-lg">
					<CardHeader className="text-center">
						Login to Continue
					</CardHeader>
					<CardBody>
						<form onSubmit={onSubmit} className="space-y-6">
							<Input 
								label="Email Address"
								placeholder="Enter your email" 
								type="email" 
								value={email} 
								onChange={e => setEmail(e.target.value)}
								error={auth.error || 'Please check your credentials'}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
									</svg>
								}
								required
							/>
							<Input 
								label="Password"
								placeholder="Enter your password" 
								type="password" 
								value={password} 
								onChange={e => setPassword(e.target.value)}
								icon={
									<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								}
								required
							/>
							<div className="flex justify-end -mt-2">
								<a href="/forgot-password" className="text-sm text-gray-700 hover:underline">Forgot password?</a>
							</div>
							
							<Button 
								className="w-full" 
								loading={auth.loading}
								type="submit"
							>
								Sign In
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
						Don't have an account? <a href="/signup" className="text-gray-900 font-medium hover:underline">Sign up</a>
					</p>
				</div>
			</div>
		</div>
	);
}