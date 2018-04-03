let cmd = require('node-cmd');
const os = require('os');

class Cmd {
    constructor () {
        this.cmd = cmd;
    }
    setPassword (password) {
        return this;
    }

    exec (arCmd, call) {
        let cmd =arCmd.join(' ');

        if (['darwin'].includes(os.platform()) )
            cmd = cmd.replace('docker', '/Applications/Docker.app/Contents/Resources/bin/docker');

        this.cmd.get(cmd, (err, data) => call(err, null, data));
    }
}

module.exports = new Cmd();
