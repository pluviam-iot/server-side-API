'use strict';

var logger = require('./utils/logger.js');
logger.info('Starting pluviam app');
var express = require('express');
var morgan = require('morgan');

var pluviam = require('./routes/api.js');
var config = require('config');

var app = express();
// app.use(morgan('combined', { 'stream': logger.stream }));
logger.debug("Overriding 'Express' logger");
// TODO logger
app.use(morgan('combined', { 'stream':

{
    write: function (str) { logger.info(str); }
  }

}));

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// If undefined in our process load our local file
var pluviamConfiguration = {};
pluviamConfiguration.dbServer = process.env.DATABASE_SERVER;
pluviamConfiguration.dbPort = process.env.DATABASE_PORT;
pluviamConfiguration.dbUser = process.env.DATABASE_USER;
pluviamConfiguration.dbPassword = process.env.DATABASE_PASSWORD;
pluviamConfiguration.dbName = process.env.DATABASE_NAME;

if (!process.env.DATABASE_SERVER) {
	// TODO
	// shutdown app
	logger.info('Environment variables not found, exiting.');
}

var port = config.get('server.api.port') || 8080;        // set our port or 8080

// ROUTES FOR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({ message: 'coded while the baby sleeps' });
});
// more routes for our API will happen here

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

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /r
app.use('/r', router);

app.use(express.static('public'));

// START THE SERVER
// ===========================================================================
app.listen(port);
logger.info('Magic happens on port ' + port);

if (app.get('env') === 'development') {
	var errorHandler = require('errorhandler');
	app.use(errorHandler());
	logger.info('Development environment, using errorhandler.');
}

process.on('SIGTERM', function () {
	console.log('Shutdown process - Sigterm signal, lets shutdown.');
	app.close(function () {
		console.log('Shutdown process - Remaining app connections responded and closed');
		pluviam.closeConnections(function () {
			console.log('Shutdown process - Database connection closed');
			console.log('Shutdown process - Success. Exiting.');
			process.exit(0);
		});
	});
});

logger.info('Pluviam app started');

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
