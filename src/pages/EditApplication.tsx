import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getApplicationById, updateApplication } from '../services/applications';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function EditApplication() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [vehicle, setVehicle] = useState('');
	const [engineNumber, setEngineNumber] = useState('');
	const [chasisNumber, setChasisNumber] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			if (!id) return;
			setLoading(true);
			setError(null);
			try {
				const res = await getApplicationById(id);
				const app = res.data?.data || res.data;
				setVehicle(app?.vehicle || '');
				setEngineNumber(app?.engineNumber || '');
				setChasisNumber(app?.chasisNumber || '');
			} catch (e: any) {
				setError(e?.message || 'Failed to load application');
			} finally { setLoading(false); }
		})();
	}, [id]);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		setLoading(true);
		setError(null);
		setSuccess(null);
		try {
			await updateApplication(id, { vehicle, engineNumber, chasisNumber });
			setSuccess('Application updated');
			setTimeout(() => navigate('/my-application'), 800);
		} catch (e: any) {
			setError(e?.message || 'Failed to update application');
		} finally { setLoading(false); }
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-2xl mx-auto px-4">
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" /></svg>
					</div>
					<h1 className="text-4xl font-bold gradient-text mb-2">Edit Application</h1>
					<p className="text-gray-600 text-lg">Update your vehicle details</p>
				</div>

				<Card className="shadow-elegant-lg">
					<CardHeader>Application Information</CardHeader>
					<CardBody>
						<form onSubmit={onSubmit} className="space-y-6">
							<Input label="Vehicle Number" placeholder="e.g., MH01AB1234" value={vehicle} onChange={e => setVehicle(e.target.value.toUpperCase())} required />
							<Input label="Engine Number" placeholder="Enter engine number" value={engineNumber} onChange={e => setEngineNumber(e.target.value)} required />
							<Input label="Chassis Number" placeholder="Enter chassis number" value={chasisNumber} onChange={e => setChasisNumber(e.target.value)} required />

							<div className="flex items-center space-x-3">
								<Button type="button" variant="outline" onClick={() => navigate('/my-application')}>Cancel</Button>
								<Button type="submit" loading={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
							</div>

							{error && <p className="text-sm text-red-600">{error}</p>}
							{success && <p className="text-sm text-green-600">{success}</p>}
						</form>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
