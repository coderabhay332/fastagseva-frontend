import type { ChangeEvent } from 'react';

interface Props {
	label: string;
	onChange: (file: File | null) => void;
	accept?: string;
	error?: string;
}

export default function FileUploader({ label, onChange, accept, error }: Props) {
	const handle = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		onChange(file);
	};

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<div className="relative">
				<input
					type="file"
					accept={accept}
					onChange={handle}
					className="sr-only"
					id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
				/>
				<label
					htmlFor={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
					className={`
						flex items-center justify-center w-full px-6 py-4 border-2 border-dashed 
						rounded-xl cursor-pointer transition-elegant hover-lift
						${error 
							? 'border-red-300 bg-red-50 hover:border-red-400' 
							: 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
						}
					`}
				>
					<div className="text-center">
						<svg
							className="mx-auto h-12 w-12 text-gray-400 mb-3"
							stroke="currentColor"
							fill="none"
							viewBox="0 0 48 48"
						>
							<path
								d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<p className="text-sm text-gray-600 font-medium mb-1">
							Click to upload {label.toLowerCase()}
						</p>
						<p className="text-xs text-gray-500">
							PNG, JPG, PDF up to 10MB
						</p>
					</div>
				</label>
			</div>
			{error && (
				<p className="text-sm text-red-600 mt-1">{error}</p>
			)}
		</div>
	);
}