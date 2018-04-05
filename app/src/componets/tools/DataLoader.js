import React from 'react';
import {connect} from 'react-redux';
import LoadAnimation from './LoadAnimation'
import routes  from '../../const/app-routes'

import {init} from '../../api/api';
const DataLoader = (state) => {
	init().then(res => {
		if (res.isDockerLoad) {
			return state.history.push(routes.dockerload);
		}

		if (res.isExistPass === false) {
			return state.history.push(routes.pass);
		}

		if (res.isNoDocker) {
			return state.history.push(routes.needDocker);
		}

		if (res.isStatus) {
			state.setStatuses(res.statuses);
			return state.history.push(routes.control);
		}

	});

	return <LoadAnimation />;

};

export default connect(
	state => ({
		store: state.dataLoader
	}),
	dispatch => ({
		redirectTo  : (redirectTo) => dispatch({type: 'REDIRECT_TO', redirectTo}),
		setStatuses : statuses     => dispatch({type: 'SET_STATUSES', statuses}),
	})
)(DataLoader);
