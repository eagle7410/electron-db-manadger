
const password = '';
const username = '';

const doit = async () => {
	var sudo = require('sudo-js');
	sudo.setPassword(password);

	// sudo.exec('service apache2 restart', function(err, pid, result) {
	sudo.exec(['docker','images'], function(err, pid, result) {
		console.log(err);
		console.log(pid);
		console.log(result);
	});
}
doit();
