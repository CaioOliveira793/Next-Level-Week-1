import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import RegistrationSucceeded from './pages/RegistrationSucceeded';

const Routes = () => {
	return (
		<BrowserRouter>
			<Route path="/" exact component={Home} />
			<Route path="/create-point" component={CreatePoint} />
			<Route path="/registration-succeeded" component={RegistrationSucceeded} />
		</BrowserRouter>
	);
}

export default Routes;
