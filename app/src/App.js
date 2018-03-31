// Libs
import React from 'react';
import './App.css';
import {Route} from 'react-router-dom';
//Const
import appRoutes from './const/app-routes'
//Logo
// import logo from './img/SQLMath.png'
// Componets
import DataLoader from './componets/tools/DataLoader'
import NeedDocker from './componets/NeedDocker/NeedDocker'
import Password from './componets/Password/Password'
import Control from './componets/Control/Control'

const App = () => (
	<div className='App'>
		<header className='App-header'>
			<img src='img/SQLMath.png' className='App-logo' alt='logo'/>
			<h1 className='App-title'>Welcome to database manager</h1>
		</header>
		<div className='App-body container'>
			<div className="row">
				<Route exact path={appRoutes.needDocker} component={NeedDocker} />
				<Route exact path={appRoutes.pass} component={Password} />
				<Route exact path={appRoutes.control} component={Control} />
				<Route exact path="/" component={DataLoader} />
			</div>
		</div>
	</div>
);

export default App;
