import { useEffect, useState } from 'react';
import { listMyPayments } from '../services/applications';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import StatusBadge from '../components/StatusBadge';
import { formatDate } from '../utils/dateUtils';

export default function Transactions() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			setLoading(true); setError(null);
			try {
				const res = await listMyPayments(1, 50);
				const payload = res.data?.data || res.data;
				setData(payload?.payments || payload || []);
			} catch (err: any) {
				setError(err?.message || 'Failed to load payments');
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-5xl mx-auto px-4">
				<Card className="shadow-elegant-lg">
					<CardHeader>My Transactions</CardHeader>
					<CardBody>
						{loading ? (
							<div className="text-center py-12">Loading...</div>
						) : error ? (
							<div className="text-center py-12 text-red-600">{error}</div>
						) : data.length === 0 ? (
							<div className="text-center py-12 text-gray-600">No transactions yet</div>
						) : (
							<div className="overflow-hidden border border-gray-200 rounded-lg">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{data.map((p: any) => (
											<tr key={p._id} className="hover:bg-gray-50">
												<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(p.createdAt)}</td>
												<td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">₹{p.amount}</td>
												<td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={(p.paymentStatus || '').toUpperCase()} /></td>
												<td className="px-4 py-3 whitespace-nowrap font-mono text-sm">{p.orderId || p.paymentId}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</CardBody>
				</Card>
			</div>
		</div>
	);
}


