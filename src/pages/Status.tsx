import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../stores';
import { getApplicationByIdThunk } from '../stores/slices/applicationSlice';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/ui/Button';

const statusSteps = [
	{ key: 'NOT SUBMITTED', label: 'Application Created', description: 'Your application has been initialized' },
	{ key: 'PENDING', label: 'Under Review', description: 'Documents are being verified' },
	{ key: 'AGENT ASSIGNED', label: 'Agent Assigned', description: 'A field agent has been assigned to your case' },
	{ key: 'DONE', label: 'Completed', description: 'Your Fastag is ready for delivery' },
];

export default function StatusPage() {
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const app = useAppSelector(s => s.application);

	useEffect(() => {
		if (id) {
			dispatch(getApplicationByIdThunk(id));
		}
	}, [id, dispatch]);

	const currentStatus = app.data?.status || 'PENDING';
	const currentStepIndex = statusSteps.findIndex(step => step.key === currentStatus);
	
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 bg-gray-900 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-elegant-lg">
						<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
					</div>
					<h1 className="text-4xl font-bold gradient-text mb-2">Application Status</h1>
					<p className="text-gray-600 text-lg">Track your Fastag application progress</p>
					<div className="mt-4">
						<Button onClick={() => id && dispatch(getApplicationByIdThunk(id))}>
							Refresh
						</Button>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Status Timeline */}
					<div className="lg:col-span-2">
						<Card className="shadow-elegant-lg">
							<CardHeader>
								Application Progress
							</CardHeader>
							<CardBody>
								<div className="space-y-8">
									{statusSteps.map((step, index) => {
										const isCompleted = index <= currentStepIndex;
										const isCurrent = index === currentStepIndex;
										const isRejected = currentStatus === 'REJECTED' && index === currentStepIndex;
										
										return (
											<div key={step.key} className="flex items-start space-x-4">
												{/* Step Icon */}
												<div className={`
													flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-elegant
													${isCompleted && !isRejected 
														? 'bg-gray-900 border-gray-900' 
														: isRejected 
														? 'bg-red-500 border-red-500'
														: 'bg-white border-gray-300'
													}
												`}>
													{isCompleted && !isRejected ? (
														<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
														</svg>
													) : isRejected ? (
														<svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
														</svg>
													) : (
														<span className={`text-lg font-bold ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
															{index + 1}
														</span>
													)}
												</div>

												{/* Step Content */}
												<div className="flex-1">
													<div className="flex items-center space-x-3 mb-2">
														<h3 className={`text-lg font-semibold ${
															isCompleted ? 'text-gray-900' : 'text-gray-500'
														}`}>
															{step.label}
														</h3>
														{isCurrent && (
															<StatusBadge status={currentStatus} />
														)}
													</div>
													<p className={`text-sm ${
														isCompleted ? 'text-gray-600' : 'text-gray-400'
													}`}>
														{step.description}
													</p>
													
													{isCurrent && currentStatus === 'AGENT ASSIGNED' && (
														<div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
															<h4 className="font-medium text-blue-900 mb-2">Agent Contact Information</h4>
															<div className="text-sm text-blue-800 space-y-1">
																<p>📧 Email: savsuresh20@gmail.com</p>
																<p>📱 Phone: +91 82867 06594</p>
																<p className="text-xs text-blue-600 mt-2">
																	The agent will contact you within 24 hours to schedule installation.
																</p>
															</div>
														</div>
													)}
												</div>

												{/* Connector Line */}
												{index < statusSteps.length - 1 && (
													<div className={`
														absolute left-6 mt-12 w-0.5 h-16 transition-elegant
														${isCompleted ? 'bg-gray-900' : 'bg-gray-300'}
													`} style={{ marginLeft: '1.5rem' }} />
												)}
											</div>
										);
									})}

									{currentStatus === 'REJECTED' && (
										<div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
											<div className="flex items-start space-x-3">
												<svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
												<div>
													<h4 className="font-medium text-red-900 mb-2">Application Rejected</h4>
													<p className="text-sm text-red-800">
														Your application has been rejected due to incomplete or invalid documentation. 
														Please contact support for assistance with resubmission.
													</p>
													<div className="mt-4">
														<button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-elegant">
															Contact Support
														</button>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</CardBody>
						</Card>
					</div>

					{/* Application Details */}
					<div className="lg:col-span-1">
						<Card className="shadow-elegant-lg sticky top-24">
							<CardHeader>
								Application Details
							</CardHeader>
							<CardBody className="space-y-6">
								<div className="space-y-4">
									<div>
										<p className="text-sm text-gray-600 mb-1">Application ID</p>
										<p className="font-mono text-sm bg-gray-100 p-2 rounded border break-all">
											{id}
										</p>
									</div>
									
									<div>
										<p className="text-sm text-gray-600 mb-1">Current Status</p>
										<StatusBadge status={currentStatus} />
									</div>
									
									{app.data?.vehicle && (
										<div>
											<p className="text-sm text-gray-600 mb-1">Vehicle Number</p>
											<p className="font-semibold text-gray-900">{app.data.vehicle}</p>
										</div>
									)}
									
									{app.data?.engineNumber && (
										<div>
											<p className="text-sm text-gray-600 mb-1">Engine Number</p>
											<p className="font-mono text-sm text-gray-900">{app.data.engineNumber}</p>
										</div>
									)}
									
									{app.data?.chasisNumber && (
										<div>
											<p className="text-sm text-gray-600 mb-1">Chassis Number</p>
											<p className="font-mono text-sm text-gray-900">{app.data.chasisNumber}</p>
										</div>
									)}
								</div>

								<div className="bg-gray-50 rounded-lg p-4">
									<h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
									{currentStatus === 'PENDING' && (
										<p className="text-sm text-gray-600">
											Your documents are being verified. You will receive an update within 24-48 hours.
										</p>
									)}
									{currentStatus === 'AGENT ASSIGNED' && (
										<p className="text-sm text-gray-600">
											An agent has been assigned and will contact you to schedule the Fastag installation.
										</p>
									)}
									{currentStatus === 'DONE' && (
										<p className="text-sm text-gray-600">
											Your Fastag has been successfully installed and is ready to use!
										</p>
									)}
									{currentStatus === 'NOT SUBMITTED' && (
										<p className="text-sm text-gray-600">
											Please complete the document upload process to proceed.
										</p>
									)}
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
