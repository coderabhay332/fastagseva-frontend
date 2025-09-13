import type { PropsWithChildren } from 'react';

interface CardProps {
	className?: string;
	hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: PropsWithChildren<CardProps>) {
	return (
		<div className={`
			rounded-2xl border border-gray-200 bg-white shadow-elegant 
			${hover ? 'transition-elegant hover-lift hover:shadow-elegant-lg' : ''}
			${className}
		`}>
			{children}
		</div>
	);
}

export function CardHeader({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
	return (
		<div className={`border-b border-gray-100 px-8 py-6 ${className}`}>
			<h2 className="text-2xl font-bold text-gray-900 gradient-text">{children}</h2>
		</div>
	);
}

export function CardBody({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
	return <div className={`px-8 py-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
	return (
		<div className={`border-t border-gray-100 px-8 py-6 bg-gray-50 rounded-b-2xl ${className}`}>
			{children}
		</div>
	);
}