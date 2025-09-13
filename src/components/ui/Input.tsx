import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

export default function Input({ 
	className = '', 
	label, 
	error, 
	icon,
	rightIcon,
	...props 
}: InputProps) {
	return (
		<div className="space-y-2">
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-2">
					{label}
				</label>
			)}
			<div className="relative">
				{icon && (
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
						{icon}
					</div>
				)}
				<input
					className={`
						block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base
						placeholder-gray-500 transition-elegant shadow-sm
						focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20
						hover:border-gray-400
						${icon ? 'pl-12' : ''}
						${rightIcon ? 'pr-12' : ''}
						${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
						${className}
					`}
					{...props}
				/>
				{rightIcon && (
					<div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400">
						{rightIcon}
					</div>
				)}
			</div>
			{error && (
				<p className="text-sm text-red-600 mt-1">{error}</p>
			)}
		</div>
	);
}