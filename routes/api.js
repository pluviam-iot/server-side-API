'use strict';

var logger = require('../utils/logger.js');
var database = require('../models/database.js');

exports.addWeather = function (req, res) {
	var weather = req.body;
	var stationId = req.params.id;
	var hashFromReq = req.get('X-Pluviam-Token');
	database.addWeather(stationId, hashFromReq, weather, function (err, success) {
		if (err) {
			res.json({ message: 'Error' });
			logger.error('fail addWeather ' + err);
			logger.error('fail addWeather ' + req.body);
		} else {
			logger.info('Success addWeather!');
			res.json({ message: 'Success' });
		}
	});
};

exports.getAllStations = function (req, res) {
	database.getAllStations(function (err, stations) {
		if (err) {
			res.json({ message: 'Error' });
			console.log('fail');
		} else {
			res.send(stations);
		}
	});
};

exports.getStationAndWeather = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving beehive: ' + id);

	var result = {};
	var returnWeather = false;
	var returnStation = false;

	database.getStation(id, function (err, station) {
		if (err) {
			res.send(result);
			console.log(err.stack || err);
		} else {
			result.station = station;
			returnStation = true;
			console.log('Success!');
			if (returnStation && returnWeather) {
				res.send(result);
			}
		}
	});
	database.getWeather(id, function (err, weather) {
		if (err) {
			// either fs.readFile or fs.writeFile returned an error
			console.log(err.stack || err);
		} else {
			result.weather = weather;
			returnWeather = true;
			console.log('Success!');
			if (returnStation && returnWeather) {
				res.send(result);
			}
		}
	});
};

exports.getWeather = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving beehive: ' + id);

	var result = {};
	database.getWeather(id, function (err, weather) {
		if (err) {
			// either fs.readFile or fs.writeFile returned an error
			console.log(err.stack || err);
		} else {
			result.weather = weather;
			console.log('Success!');
			res.send(result);
		}
	});
};

exports.getStationAndLastWeather = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving beehive: ' + id);

	var result = {};
	var processStation = {};
	var resultStation = {};
	var returnWeather = false;
	var returnStation = false;

	database.getStation(id, function (err, station) {
		if (err) {
			res.send(result);
			console.log(err.stack || err);
		} else {
			processStation = station;
			resultStation.name = station.fullName;
			resultStation.country = station.location.country;
			resultStation.county = station.location.county;
			resultStation.city = station.location.city;
			resultStation.url = 'http://pluvi.am/' + station.location.countryCode.toLowerCase() + '/' +
								station.location.countyCode.toLowerCase() + '/' +
								station.location.city.toLowerCase() + '/' +	station.urlName;
			result.station = resultStation;
			returnStation = true;
			console.log('Success!');
			if (returnStation && returnWeather) {
				result = joinLastWeatherAndStation(processStation, result);
				res.send(result);
			}
		}
	});
	database.getLastWeather(id, function (err, weather) {
		if (err) {
			console.log(err.stack || err);
		} else {
			result.weather = weather;
			returnWeather = true;
			console.log('Success!');
			if (returnStation && returnWeather) {
				result = joinLastWeatherAndStation(processStation, result);
				res.send(result);
			}
		}
	});
};

// adds units to values, ex.: mm to precipitation
function joinLastWeatherAndStation (station, result) {
	station.inputs.forEach(function (input) {
		result.weather[input.name + 'Unit'] = input.unit;
	});
	return result;
}
