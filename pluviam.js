var express = require('express');

var pluviam = require('./routes/api.js');
var config = require('config');

var app = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = config.get('server.api.port') || 8080;        // set our port or 8080

// ROUTES FOR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
	res.json({ message: 'Welcome to pluvi.am api!' });
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
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

if (app.get('env') === 'development') {
	var errorHandler = require('errorhandler');
	app.use(errorHandler());
}

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
