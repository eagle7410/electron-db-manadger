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
		await fs.unlink(`${__dirname}/../configs/pass.json`);
		log.success('deletePassFile ok.');
	} catch (err) {
		log.error('deletePassFile err', err);
	}
};

const createProdStart = async () => {
	try {
		await createIndex();
		await createServer();
		await deletePassFile();

		log.success('Success ...');

	} catch (e) {
		log.error('Fail', e);
	}
};

createProdStart();
