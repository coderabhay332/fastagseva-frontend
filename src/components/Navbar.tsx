import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../stores';
import Button from './ui/Button';
import { logoutThunk } from '../stores/slices/authSlice';

export default function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user, accessToken } = useAppSelector(s => s.auth);

	const isActive = (path: string) => location.pathname === path;

	const navLinks = [
		{ path: '/create', label: 'Create', show: !!accessToken && user?.role !== 'ADMIN' },
		{ path: '/my-application', label: 'My Applications', show: !!accessToken && user?.role !== 'ADMIN' },
		{ path: '/delivery', label: 'Delivery', show: !!accessToken && user?.role !== 'ADMIN' },
		{ path: '/transactions', label: 'Transactions', show: !!accessToken && user?.role !== 'ADMIN' },
		{ path: '/profile', label: 'Profile', show: !!accessToken },
		{ path: '/admin', label: 'Admin', show: !!accessToken && user?.role === 'ADMIN' },
	];

	const handleLogout = async () => {
		await dispatch(logoutThunk());
		navigate('/login');
	};

	return (
		<nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
			<div className="mx-auto max-w-6xl px-6">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link 
						to="/" 
						className="flex items-center space-x-2 text-2xl font-bold gradient-text hover:scale-105 transition-elegant"
					>
						<div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
							<span className="text-white text-sm font-bold">F</span>
						</div>
						<span>Fastag</span>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center space-x-1">
						{navLinks.filter(link => link.show).map(({ path, label }) => (
							<Link
								key={path}
								to={path}
								className={`
									px-4 py-2 rounded-lg text-sm font-medium transition-elegant
									${isActive(path) 
										? 'bg-gray-900 text-white shadow-elegant' 
										: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
									}
								`}
							>
								{label}
							</Link>
						))}
					</div>

					{/* Auth Actions */}
					<div className="hidden md:flex items-center">
						{accessToken ? (
							<Button variant="secondary" size="sm" onClick={handleLogout}>
								Logout
							</Button>
						) : (
							<Link
								to="/login"
								className="px-4 py-2 rounded-lg text-sm font-medium transition-elegant text-gray-700 hover:text-gray-900 hover:bg-gray-100"
							>
								Login
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}