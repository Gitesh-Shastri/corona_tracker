const fs = require('fs');
const koa = require('koa');
const path = require('path');
const https = require('https');
const cors = require('koa-cors');
const json = require('koa-json');
const render = require('koa-ejs');
const serve = require('koa-static');
const logger = require('koa-logger');
const koaRouter = require('koa-router');
const { resolve } = require('path');

const app = new koa();
const router = new koaRouter();

const port = process.env.PORT || 3000;

app.use(json());
app.use(logger());
app.use(cors());

app.use(serve(__dirname + '/public'));

render(app, {
	root: path.join(__dirname, 'public'),
	layout: 'index',
	viewExt: 'html',
	cache: false,
	debug: false
});

function readFile() {
	return new Promise(function(resolve, reject) {
		fs.readFile('state_data.json', (err, data) => {
			if (err) {
				resolve({ status: 'failure', data: [] });
			} else {
				state = JSON.parse(data);
				state.time_elapse = Date.now() - state.time;
				resolve({ status: 'success', data: state });
			}
		});
	});
}

function readDataFromNet() {
	return new Promise(function(resolve, reject) {
		https
			.get('https://www.mohfw.gov.in/data/datanew.json', (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});

				resp.on('end', () => {
					let state_data = {
						time: Date.now(),
						data: JSON.parse(data)
					};
					resp_data = JSON.stringify(state_data);
					fs.writeFileSync('state_data.json', resp_data);
					resolve({ data: state_data.data });
				});
			})
			.on('error', (err) => {
				resolve({ data: [] });
			});
	});
}

router.get('/get_tracker_data', async (ctx) => {
	let state = [];
	data = await readFile();
	console.log(data);
	if (data.status == 'failure' || data.data.time_elapse > 900000) {
		resp_data = await readDataFromNet();
		ctx.body = resp_data.data;
	} else {
		ctx.body = data.data.data;
	}
});

router.get('/', async (ctx) => {
	await ctx.render('index');
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => console.log('Server Started .... '));
