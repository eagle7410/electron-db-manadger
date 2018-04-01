const fs   = require('fs-extra');
const root = `${__dirname}/../`;
const {ConsoleColorLog} = require('console-color');
const log = new ConsoleColorLog();

const fileContentChange = async (pathRead, pathWrite, promiseWrite) => {
	let data = await fs.readFile(pathRead, 'utf8');

	data =  await promiseWrite(data.toString());

	await fs.writeFile(pathWrite, data);

};

const createServer = async () => {
	const transform = data => new Promise(
		write => write(
			data.replace(/\n(.*)console\.log\(\`\:\: \$\{action\}([^\n])+/, '')
	));

	await fileContentChange(root + 'server-dev.js', root + 'server.js', transform);

	log.success('Create server is ok.');
};

const createIndex = async () => {
	const transform = data => new Promise(
		write => {
			write(
				data.replace(/\/\/~\sdev([^~])+\/\/~\send(.*)\n/gi, '')
					.replace('mainWindow.loadURL(\'http://localhost:3000/\');', 'mainWindow.loadURL(`file://${__dirname}/html/index.html`);')
					.replace(/\n(\t){0,}\n/g, '\n')
					.replace('./server-dev', './server')
			)

		});

	await fileContentChange(root + 'index-app-dev.js', root + 'index-app.js', transform);

	log.success('Index create is ok.');
};

const deletePassFile = async () => {
	try {
		await fs.writeJsonSync(`${__dirname}/../configs/pass.json`, {pass : ''});
		log.success('deletePassFile ok.');
	} catch (err) {
		log.error('deletePassFile err', err);
	}
};


const correctPackageJson = () => new Promise((ok, bad) => {
	const path = root + 'package.json';
	fs.readFile(path, 'utf8', (err,data) => {
		if (err) {
			log.error('correctPackageJson readFile bab', err);
			return bad();
		}

		data = data.toString()
			.replace(/"main"\: "index([^\n])+/, '"main": "index-app.js",');

		fs.writeFile(path, data, err => {
			if (err) {
				log.error('correctPackageJson writeFile bab', err);
				return bad();
			}

			log.success('correctPackageJson ok');
			return ok();
		});

	});
});

const setInitialConfig = async () => {
	try {
		await fs.writeJsonSync(`${__dirname}/../configs/conf.json`, {
				"installs": {
					"allReady": false,
					"images": {
						"monogo": false,
						"mysql": false,
						"phpmyadmin": false
					},
					"containers": {
						"monogo": false,
						"mysql": false,
						"phpmyadmin": false
					}
				}
		});

		log.success('setInitialConfig ok.');
	} catch (err) {
		log.error('setInitialConfig err', err);
	}
}

const createProdStart = async () => {
	try {
		await createIndex();
		await createServer();
		await deletePassFile();
		await correctPackageJson();
		await setInitialConfig();

		log.success('Success ...');

	} catch (e) {
		log.error('Fail', e);
	}
};

createProdStart();
