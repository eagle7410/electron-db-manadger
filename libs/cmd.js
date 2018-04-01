let cmd = require('node-cmd');

class Cmd {
	constructor () {
		this._sudo = cmd;
	}
	setPassword (password) {
		return this;
	}

	exec (arCmd, call) {
		this._sudo.get(arCmd.join(' '), (err, data) => call(err, null, data));
	}
}

module.exports = new Cmd();
