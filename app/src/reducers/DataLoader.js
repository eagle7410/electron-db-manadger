const initialState = {
	isLoad     : true,
	redirectTo : false
};

const dataLoader = (state = initialState, action) => {
	// eslint-disable-next-line
	switch (action.type) {
		case 'REDIRECT_TO':
			return {
				...state,
				isLoad       : false,
				redirectTo   : action.redirectTo,
			};
	}

	return state;
};

export {dataLoader};
