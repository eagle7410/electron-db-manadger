import React from 'react';
import {connect} from 'react-redux';
import LoadAnimation from './LoadAnimation'
import routes  from '../../const/app-routes'

import {init} from '../../api/api';
const DataLoader = (state) => {

	if (state.store.err) {

		return (
			<div>
				<h1>App init error</h1>
				<h1 style={{color:'red'}}>{state.store.err}</h1>
			</div>
		)

	} else {

        init().then(
        	res => {

				state.clearError();

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

			},
			e => {
        		let setError;

        		if (typeof e === "string") setError = e;
					else if (e.message) setError = e.message;
					else setError = JSON.stringify(e, null, '\t');

        		state.setError(setError);

            }
		);
	}

	return <LoadAnimation />;

};

export default connect(
	state => ({
		store: state.dataLoader
	}),
	dispatch => ({
		clearError  : ()           => dispatch({ type: 'MOVE_ERROR'}),
		setError    : (err)        => dispatch({ type: 'SET_ERROR', data: err }),
		redirectTo  : (redirectTo) => dispatch({type: 'REDIRECT_TO', redirectTo}),
		setStatuses : statuses     => dispatch({type: 'SET_STATUSES', statuses}),
	})
)(DataLoader);
