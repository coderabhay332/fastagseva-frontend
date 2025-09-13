import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../stores';

export default function ProtectedRoute() {
	const { accessToken } = useAppSelector(s => s.auth);
	const location = useLocation();
	if (!accessToken) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}
	return <Outlet />;
}


