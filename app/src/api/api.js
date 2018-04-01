import {save, reqFull, get} from '../utils/Req'

const init = () => reqFull(get, '/init');
const savePass = (pass) => reqFull(save, '/pass', {pass});
const toggleService = service => reqFull(save, '/status', {service});

export {
	init,
	savePass,
	toggleService
};
