const fs    = require('fs-extra');
const root  = `${__dirname}/../`;
const {ConsoleColorLog} = require('console-color');
const log = new ConsoleColorLog();

const rebuildStatic = () => new Promise((ok, bad) => {
	const cmd     = require('node-cmd');
	let   prjPath = __dirname + '/..';

	prjPath = prjPath.replace(/\s/g,'\\ ');

	cmd.get(
		`rm -r ${prjPath}/html
        cd ${prjPath}/app
        export PUBLIC_URL=../html 
        npm run build
        cp -R ./build ../html
        `,
		function(err, data, stderr){
			if (err) {
				log.error('RebuildStatic bad', err);
				return bad();
			}

			log.success('RebuildStatic ok', data);
			ok();

		}
	);
});

const fileContentChange = async (pathRead, pathWrite, promiseWrite) => {
	let data = await fs.readFile(pathRead, 'utf8');

	data =  await promiseWrite(data.toString());

	await fs.writeFile(pathWrite, data);

};

const setBaseForRelateURLs = async () => {

	const indexHtml = `${__dirname}/../html/index.html`;

	await fileContentChange(indexHtml, indexHtml,  data => new Promise((write) => write(data.replace('</head>', '<base href="./"></head>'))));

	log.success('setBaseForRelateURLs ok');
}

const buildProduction = async () => {
	try {
		await rebuildStatic();
		await setBaseForRelateURLs();

		log.success('Build production app is Succeess');

	} catch (e) {
		log.error('Error build', e)
	}
};

buildProduction();
