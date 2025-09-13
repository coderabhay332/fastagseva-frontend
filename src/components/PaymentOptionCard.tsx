interface Props {
	bank: string;
	price: number;
	selected?: boolean;
	onSelect?: () => void;
}

const bankLogos: Record<string, string> = {
	'SBI': '🏦',
	'IDFC': '🏛️',
	'LivQuick': '⚡',
	'Bajaj': '🚗'
};

export default function PaymentOptionCard({ bank, price, selected, onSelect }: Props) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={`
				w-full text-left rounded-2xl border-2 p-6 transition-elegant hover-lift shadow-elegant
				${selected 
					? 'border-gray-900 bg-gray-50 shadow-elegant-lg' 
					: 'border-gray-200 hover:border-gray-400 hover:shadow-elegant-lg'
				}
			`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="text-3xl">
						{bankLogos[bank] || '🏦'}
					</div>
					<div>
						<div className="font-bold text-lg text-gray-900">{bank}</div>
						<div className="text-sm text-gray-500">Processing Fee Included</div>
					</div>
				</div>
				<div className="text-right">
					<div className="text-2xl font-bold text-gray-900">₹{price}</div>
					{selected && (
						<div className="text-sm text-gray-600 mt-1">✓ Selected</div>
					)}
				</div>
			</div>
		</button>
	);
}