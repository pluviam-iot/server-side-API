'use strict';

var util = require('./utils/util.js');
var logger = require('./utils/logger.js');

logger.info('Starting pluviam app');
var express = require('express');
var morgan = require('morgan');

var pluviam = require('./routes/api.js');
var config = require('config');

var app = express();
logger.debug(util.getMicrotime() + ' - Overriding Express logger');
// TODO logger
logger.info(util.getMicrotime() + ' - Environment set: ' + app.get('env'));
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
var router = express.Router();              // get an instance of the express Router

router.get('/', function (req, res) {
	res.json({ message: 'coded while the baby sleeps' });
});

router.route('/stations/')
.get(function (req, res) {
	pluviam.getAllStations(req, res);
});

router.route('/stations/:id')
.post(function (req, res) {
	pluviam.addWeather(req, res);
})
.get(function (req, res) {
	pluviam.getWeather(req, res);
});

// routes base origin
app.use('/r', router);

app.use(express.static('public'));

// START THE SERVER
// ===========================================================================
var pluviamServer = app.listen(port);
logger.info(util.getMicrotime() + ' - Magic happens on port ' + port);

if (app.get('env') === 'development') {
	var errorHandler = require('errorhandler');
	app.use(errorHandler());
	logger.info(util.getMicrotime() + ' - Development environment, using errorhandler.');
}

// TODO
// shutdown app
process.on('SIGTERM', function () {
	console.log('Shutdown process - Sigterm signal, lets shutdown.');
	pluviamServer.close(function () {
		console.log('Shutdown process - Remaining app connections responded and closed');
		pluviam.closeConnections(function () {
			console.log('Shutdown process - Database connection closed');
			console.log('Shutdown process - Success. Exiting.');
			process.exit(0);
		});
	});
});

logger.info(util.getMicrotime() + ' - Pluviam app started');

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
