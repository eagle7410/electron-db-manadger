import {save, move, update, reqFull, get} from '../utils/Req'

// const add  = name       => reqFull(save, type, name);
// const del  = id         => reqFull(move, type, id);
// const edit = (id, name) => reqFull(update, type, {id : id, name : name});

const init = () => reqFull(get, '/init');
const savePass = (pass) => reqFull(save, '/pass', {pass});
const toggleService = service => reqFull(save, '/status', {service});

export {
	init,
	savePass,
	toggleService
};
