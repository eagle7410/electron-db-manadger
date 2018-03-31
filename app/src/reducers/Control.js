const initialState = {
	mongo   : false,
	mysql   : false,
	myadmin : false,
	wait    : false
};

const control = (state = initialState, action) => {
	// eslint-disable-next-line
	switch (action.type) {
		case 'SET_STATUSES':
			return {
				...state,
				...action.statuses
			};
		case 'WAIT' :
			return {
				...state,
				wait: action.service
			};

		case 'STATUS_CHANGE':
			let stateNew = {
				...state,
				wait: false
			};

			stateNew[action.service] = action.status;

			return stateNew;

	}

	return state;
};

export {control};
