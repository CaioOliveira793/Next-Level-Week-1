import React from 'react';
import { FiCheckCircle } from 'react-icons/fi'

import './styles.css';

const RegistrationSucceeded: React.FC = () => {
	return (
		<div id="page-registration-succeeded">
			<FiCheckCircle size={50} color="#34CB79" />
			<span>Cadastro concluído!</span>
		</div>
	);
}

export default RegistrationSucceeded;
