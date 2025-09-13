import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	loading?: boolean;
}

const base = 'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-elegant';

const variants: Record<Variant, string> = {
	primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 shadow-lg hover:shadow-xl',
	secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 hover:border-gray-400',
	danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
	ghost: 'bg-transparent hover:bg-gray-100 text-gray-900 border border-transparent',
	outline: 'bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white focus:ring-gray-500'
};

const sizes: Record<Size, string> = {
	sm: 'px-4 py-2 text-sm',
	md: 'px-6 py-3 text-base',
	lg: 'px-8 py-4 text-lg',
};

export default function Button({ 
	variant = 'primary', 
	size = 'md', 
	loading = false,
	className = '', 
	children, 
	disabled,
	...props 
}: PropsWithChildren<ButtonProps>) {
	return (
		<button 
			className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} 
			disabled={disabled || loading}
			{...props}
		>
			{loading && (
				<svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			)}
			{children}
		</button>
	);
}