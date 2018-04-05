const initialState = {
	isLoad          : true,
	redirectTo      : false,
	dockerLoadCount : 1,
	labelDockerLoad : 'Docker load',
	labelDockerLoadPoints : '.'
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
		case 'DOCKER_LOAD_NEXT_POINT':
			let count = state.dockerLoadCount;
			let points;

			if (count === 4) count = 1;

			switch (count) {
				case 1: points =  '.'; break;
				case 2: points =  '..'; break;
				case 3: points =  '...'; break;
			}

			count++;

			return {
				...state,
				dockerLoadCount : count,
				labelDockerLoadPoints : points,
			}
	}

	return state;
};

export {dataLoader};
