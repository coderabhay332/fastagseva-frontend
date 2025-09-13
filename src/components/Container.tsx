import type { PropsWithChildren } from 'react';

interface ContainerProps {
	size?: 'sm' | 'md' | 'lg' | 'xl';
	className?: string;
}

const sizes = {
	sm: 'max-w-2xl',
	md: 'max-w-4xl',
	lg: 'max-w-6xl',
	xl: 'max-w-7xl'
};

export default function Container({ 
	children, 
	size = 'lg', 
	className = '' 
}: PropsWithChildren<ContainerProps>) {
	return (
		<div className={`mx-auto ${sizes[size]} px-6 py-8 ${className}`}>
			{children}
		</div>
	);
}