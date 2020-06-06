import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface DropzoneProps {
	onFileChange: (file: File[]) => void
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileChange }) => {
	const [selectedFileUrl, setSelectedFileUrl] = useState('');

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const [file] = acceptedFiles;

		const fileUrl = URL.createObjectURL(file);

		setSelectedFileUrl(fileUrl);
		onFileChange(acceptedFiles);
	}, [onFileChange]);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: 'image/*'
	});

	return (
		<div className="dropzone" {...getRootProps()} >
			<input {...getInputProps()} accept="image/*" />
			{selectedFileUrl !== '' ?
				<img src={selectedFileUrl} alt="Collect point thumbnail" /> :
				<p>
					<FiUpload color="#4ECB79" size={24} />
					Image do estabelecimento
				</p>
			}
		</div>
	);
}

export default Dropzone;
