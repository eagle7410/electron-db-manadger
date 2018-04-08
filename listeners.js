const send           = require('./libs/send');
const {commandParse} = require('./libs/comman-parser');
const fs             = require('fs-extra');
const os             = require('os');
const commands       = require('./configs/docker-commands');
const SudoExec       = require('./libs/sudo-promt-promise');
const sudoPass       = `${__dirname}/configs/pass.json`;
const sudoExec       = new SudoExec();
const log            = require('./libs/logger');
const SocketServer   = require('./libs/socket-server');

let socketServer;

let appConfigName = 'conf';
let appConfig = require(`./configs/${appConfigName}`);
let containersStatus;
let password;

module.exports = {
	setWindow : window => {
		socketServer   = new SocketServer(window);

		return module.exports
	},
	config: () => [
		{
			route : '/docker-load',
			handler :  async (res, action, data) => {
				try {
					await sudoExec.setPassword(password).exec(commands.dockerInfo);

					send.ok(res, action, {isDockerLoaded : true});

				} catch (e) {
					send.ok(res, action, {isDockerLoaded : false});
				}
			}

		},
		{
			route: '/status',
			type : send.reqTypes.post,
			handler: async (res, action, data) => {
				let {service} = data;
				let cmd = ['docker', containersStatus[service] ? 'stop' : 'start', service];

				let reslt = await sudoExec.setPassword(password).exec(cmd);

				containersStatus = await containersActive(sudoExec);

				send.ok(res, action, {service, status: containersStatus[service]});
			}
		},
		{
			route: '/init',
			handler: async (res, action) => {
				try {


					let {pass} = await fs.readJson(sudoPass);

					if (!pass) {
						return send.ok(res, action, {isExistPass : false});
					}

					password = pass;

					let {result} = await sudoExec.setPassword(pass).exec(commands.dockerVerion);

					if (!~result.indexOf('Docker version')) {
						return send.ok(res, action, {isNoDocker : true});
					}

					await sudoExec.setPassword(pass).exec(commands.dockerInfo);

					if (!appConfig.installs.allReady) {
						socketServer.emit('log-add', {mess: 'Run Install...'});
						await checkInstallAll(sudoExec);
					}

					containersStatus = await containersActive(sudoExec);

					send.ok(res, action, {isStatus : true , statuses : containersStatus});

				} catch (e) {

				    console.error(e);

					if (e.message && ~e.message.indexOf('docker info')) {
						return send.ok(res, action, {isDockerLoad : true});
					}

					send.err(res, action, e.message ? e.message : e);
				}
			}
		},
		{
			route: '/pass',
			type : send.reqTypes.post,
			handler: async (res, action, data) => {
				try {
					let {pass} = data;

					await sudoExec.setPassword(pass).exec([os.platform() === 'win32'? 'dir' : 'ls']);

					fs.writeJsonSync(sudoPass, data);

					return send.ok(res, action, {status: 'OK'});

				} catch (e) {
					let err = e;

					if (e === true) {
						err = {type: 'badPass'}
					}

					console.log('send err', err, e);
					return send.err(res, action, err);
				}
			}
		},

	]
};

async function containersActive(sudoExec) {
	let out = await sudoExec.exec(commands.containerListActive);
	let containers = commandParse(out.result);
	containers.shift();

	let resilt = {
		mongo   : false,
		mysql   : false,
		myadmin : false,
	};

	for (let container of containers) {
		let name = container[container.length - 1 ];

		switch (name) {
			case 'mongo'         :
			case 'mysql'         :
			case 'myadmin'       :
			case 'redis'         :
			case 'redis_manager' :
			case 'postgis'       :
			case 'postgres'      :
			case 'pgadmin'       :
				resilt[name] = true;
				break;
		}
	}

	return resilt;
}

async function checkInstallAll(sudoExec) {
	let out = await sudoExec.exec(commands.imagesList);
	let images = commandParse(out.result);
	images.shift();

	out = await sudoExec.exec(commands.containerListAll);
	let containers = commandParse(out.result);
	containers.shift();

	for (let image of images) {
		switch (image[0]) {
			case 'mongo' :
				appConfig.installs.images.mongo = true;
				break;

			case 'phpmyadmin/phpmyadmin' :
				appConfig.installs.images.myadmin = true;
				break;

			case 'mysql/mysql-server' :
				appConfig.installs.images.mysql = true;
				break;
			case 'redis' :
				appConfig.installs.images.redis = true;
				break;
			case 'tenstartups/redis-commander' :
				appConfig.installs.images.redis_manager = true;
				break;
			case 'mdillon/postgis' :
				appConfig.installs.images.postgis = true;
				break;
			case 'postgres' :
				appConfig.installs.images.postgres = true;
				break;
			case 'fenglc/pgadmin4' :
				appConfig.installs.images.pgadmin = true;
				break;
		}
	}

	socketServer.emit('log-add', {mess: 'End get list images'});

	for(let image in appConfig.installs.images) {
		if (!appConfig.installs.images[image]) {

			socketServer.emit('log-add', {mess: 'Install image ' + image});

			log.add(`Run pull image ${image} cmd:`, commands.installs.images[image]);
			await sudoExec.exec(commands.installs.images[image]);
			appConfig.installs.images[image] = true;

		}

		socketServer.emit('log-add', {mess: `Image ${image} be install. ok`});
	}

	for (let container of containers) {
		switch (container[container.length - 1 ]) {
			case 'mongo'         :
			case 'mysql'         :
			case 'myadmin'       :
			case 'redis'         :
			case 'redis_manager' :
			case 'postgis'       :
			case 'postgres'      :
			case 'pgadmin'       :

				appConfig.installs.containers[container[container.length - 1 ]] = true;
				break;
		}
	}

	socketServer.emit('log-add', {mess: 'End get list containers'});

	for(let container in appConfig.installs.containers) {

		if (!appConfig.installs.containers[container]) {

			log.add(`Run create container ${container} cmd:`, commands.installs.containers[container]);
			socketServer.emit('log-add', {mess: 'Install container ' + container});

			await sudoExec.exec(commands.installs.containers[container]);
			appConfig.installs.containers[container] = true;
		}

		socketServer.emit('log-add', {mess: `Container ${container} be install. ok`});
	}

	appConfig.installs.allReady = true;
	fs.writeJsonSync(`${__dirname}/configs/${appConfigName}.json`, appConfig);

	return true;
}
