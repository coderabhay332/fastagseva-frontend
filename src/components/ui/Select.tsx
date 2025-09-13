import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	children: React.ReactNode;
}

export default function Select({ 
	className = '', 
	label, 
	error, 
	children,
	...props 
}: SelectProps) {
	return (
		<div className="space-y-2">
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-2">
					{label}
				</label>
			)}
			<div className="relative">
				<select
					className={`
						block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base
						transition-elegant shadow-sm appearance-none
						focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20
						hover:border-gray-400
						${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
						${className}
					`}
					{...props}
				>
					{children}
				</select>
				{/* Custom dropdown arrow */}
				<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
					<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</div>
			{error && (
				<p className="text-sm text-red-600 mt-1">{error}</p>
			)}
		</div>
	);
}