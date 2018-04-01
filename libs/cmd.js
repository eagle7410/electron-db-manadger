let cmd = require('node-cmd');

class Cmd {
	constructor () {
		this.cmd = cmd;
	}
	setPassword (password) {
		return this;
	}

	exec (arCmd, call) {
		this.cmd.get(arCmd.join(' '), (err, data) => call(err, null, data));
	}
}

module.exports = new Cmd();
