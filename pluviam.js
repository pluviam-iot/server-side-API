'use strict';

var pluviamVersion = '1.5.5';

var logger = require('./utils/logger.js');
logger.info('Starting pluviam app...');
var envs = require('./utils/env.js');

var util = require('./utils/util.js');
var stats = require('./utils/stats.js');

var slackBot = require('./utils/slackBot.js');

var express = require('express');
var morgan = require('morgan');

var pluviam = require('./routes/api.js');
var config = require('config');

var CronJob = require('cron').CronJob;

var app = express();
logger.debug(util.getMicrotime() + ' - Overriding Express logger');

app.use(morgan('combined', { 'stream':
{
	write: function (str) { logger.info(str); }
}
}));

// this will let us get the data from a POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = config.get('server.api.port') || 8080;        // set our port or 8080

// Routes for API
var router = express.Router();
var routerBackend = express.Router();

// cors
// TODO better origin validator
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

router.get('/', function (req, res) {
	res.json({ service: 'Pluviam API', version: pluviamVersion, message: 'coded while the baby sleeps!' });
	stats.apiCalls.frontEndAPIRoot++;
});

routerBackend.get('/', function (req, res) {
	res.json({ service: 'Pluviam Backend API', version: pluviamVersion, message: 'coded while the baby sleeps!' });
	stats.apiCalls.backendAPIRoot++;
});

router.route('/stations/')
.get(function (req, res) {
	pluviam.getAllStations(req, res);
	stats.apiCalls.frontEndAllStations++;
});

routerBackend.route('/stations/:id')
.post(function (req, res) {
	pluviam.addWeather(req, res);
	stats.apiCalls.backEndStationAddWeather++;
});

router.route('/stations/:id')
.get(function (req, res) {
	pluviam.getStationAndWeather(req, res);
	stats.apiCalls.frontEndStationAndWeather++;
});

router.route('/stations/:id/weather')
.get(function (req, res) {
	pluviam.getWeather(req, res);
	stats.apiCalls.frontEndWeather++;
});

router.route('/stations/:id/last')
.get(function (req, res) {
	pluviam.getStationAndLastWeather(req, res);
	stats.apiCalls.frontEndStationAndWeatherLast++;
});

// routes base origin
app.use('/r', router);
app.use('/b', routerBackend);

app.use(express.static('public'));

// start the server
var pluviamServer = app.listen(port);
logger.info(util.getMicrotime() + ' - Magic happens on port ' + port);

if (envs.environment === 'development') {
	var errorHandler = require('errorhandler');
	app.use(errorHandler());
	logger.info(util.getMicrotime() + ' - Development environment, using errorhandler.');
}

// TODO some errors doing this
// shutdown app
process.on('SIGTERM', function () {
	logger.info('Shutdown process - Sigterm signal, lets shutdown.');
	app.close(function () {
		logger.info('Shutdown process - Remaining app connections responded and closed');
		app.closeConnections(function () {
			logger.info('Shutdown process - Database connection closed');
			logger.info('Shutdown process - Success. Exiting.');
			process.exit(0);
		});
	});
});

logger.info(util.getMicrotime() + ' - Starting schedulers');
new CronJob('00 00 * * * *', function () {
	slackBot.sendMessage('Pluviam Stats ' + envs.environment +
		'\nbackendAPIRoot ' + stats.apiCalls.backendAPIRoot +
		'\nbackEndStationAddWeather ' + stats.apiCalls.backEndStationAddWeather +
		'\nfrontEndAPIRoot ' + stats.apiCalls.frontEndAPIRoot +
		'\nfrontEndAllStations ' + stats.apiCalls.frontEndAllStations +
		'\frontEndStationAndWeather ' + stats.apiCalls.frontEndStationAndWeather +
		'\nfrontEndWeather ' + stats.apiCalls.frontEndWeather +
		'\nfrontEndStationAndWeatherLast ' + stats.apiCalls.frontEndStationAndWeatherLast
	);
	stats.apiCallsReset();
}, null, true, 'America/Los_Angeles');

logger.info(util.getMicrotime() + ' - Pluviam app started');
slackBot.sendMessage('Pluviam app v' + pluviamVersion + ' started \n' +
						'Environment:' + envs.environment +
						'\nPackages:' +
						JSON.stringify(process.versions));

/* get api.pluvi.am/r/stations/
post api.pluvi.am/r/weather/

get  api.pluvi.am/r/stations/br/rs/erechim/station-name - station data
post api.pluvi.am/r/stations/br/rs/erechim/station-name/station_token

get  api.pluvi.am/r/stations - stations list
get  api.pluvi.am/r/stations/public-id - station data

get  api.pluvi.am/r/stations/br - br stations list
get  api.pluvi.am/r/stations/br/rs - br/rs stations list
get  api.pluvi.am/r/stations/br/rs/erechim - br/rs/erechim stations list
get  api.pluvi.am/r/stations/br/rs/erechim/station-name - station information

get  api.pluvi.am/r/stations/station-private-token/debug
*/
