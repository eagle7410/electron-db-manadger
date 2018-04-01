const SudoExec       = require('./libs/sudo-promt-promise');
const sudoExec       = new SudoExec();/**
 * Created by Igor on 01.04.2018.
 */
const cmd     = require('node-cmd');

cmd.get('docker ps',function(err, data, stderr) {
	// TODO: clear
	console.log('err', err);
	console.log('data', data);
	console.log('stderr', stderr);
})
