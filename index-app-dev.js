const electron      = require('electron');
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu          = electron.Menu;
const server        = require('./server-dev');
const sudoPromt     = require('./libs/sudo-promt-promise');
const commads       = require('./const/docker-commands');

app.on('ready', () => {
	const screenElectron = electron.screen;
	const mainScreen = screenElectron.getPrimaryDisplay();
	const dimensions = mainScreen.size;

	const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
	//noinspection JSUnresolvedFunction
	installExtension(REACT_DEVELOPER_TOOLS)
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err));
	//noinspection JSUnresolvedFunction
	installExtension(REDUX_DEVTOOLS)
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err));

	var mainWindow = new BrowserWindow({
		width  : 400,
		height : 600
	});

	server.run(mainWindow).then(() => {
		// mainWindow.maximize();
		mainWindow.toggleDevTools();

		mainWindow.loadURL('http://localhost:3000/');

		mainWindow.on('closed', () => {
			mainWindow = null;
			app.quit();
		});

		require('./menu-app').add(Menu, app);
	});




});
