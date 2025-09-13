interface Props { 
	status?: string;
	size?: 'sm' | 'md' | 'lg';
}

const colorMap: Record<string, string> = {
	'NOT SUBMITTED': 'bg-gray-100 text-gray-800 border-gray-300',
	'PENDING': 'bg-yellow-50 text-yellow-800 border-yellow-300',
	'AGENT ASSIGNED': 'bg-blue-50 text-blue-800 border-blue-300',
	'REJECTED': 'bg-red-50 text-red-800 border-red-300',
	'DONE': 'bg-green-50 text-green-800 border-green-300',
};

const sizeMap = {
	sm: 'px-2 py-1 text-xs',
	md: 'px-3 py-1.5 text-sm',
	lg: 'px-4 py-2 text-base'
};

export default function StatusBadge({ status = 'PENDING', size = 'md' }: Props) {
	const colors = colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-300';
	const sizing = sizeMap[size];
	
	return (
		<span className={`
			inline-flex items-center rounded-full border font-medium transition-elegant
			${colors} ${sizing}
		`}>
			<div className={`w-2 h-2 rounded-full mr-2 ${
				status === 'DONE' ? 'bg-green-500' :
				status === 'REJECTED' ? 'bg-red-500' :
				status === 'AGENT ASSIGNED' ? 'bg-blue-500' :
				status === 'PENDING' ? 'bg-yellow-500' :
				'bg-gray-500'
			}`} />
			{status}
		</span>
	);
}