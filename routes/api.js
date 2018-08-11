'use strict';

var logger = require('../utils/logger.js');
var database = require('../models/database.js');
var slackBot = require('../utils/slackBot.js');
const StatusService = require('../services/status-service');

exports.addWeather = function (req, res) {
	var weather = req.body;
	var stationId = req.params.id;
	var hashFromReq = req.get('X-Pluviam-Token');
	database.addWeather(stationId, hashFromReq, weather, function (err, success) {
		if (err) {
			res.json({ message: 'Error' });
			logger.error('Fail addWeather ' + err);
			logger.error('Fail addWeather ' + req.body);
		} else {
			res.json({ message: 'Success' });
			logger.info('Success addWeather!');
		}
	});
};

exports.addBulkWeather = function (req, res) {
	var weather = req.body;
	var stationId = req.params.id;
	var hashFromReq = req.get('X-Pluviam-Token');
	database.addBulkWeather(stationId, hashFromReq, weather, function (err, success) {
		if (err) {
			res.json({ message: 'Error' });
			logger.error('Fail addWeather ' + err);
			logger.error('Fail addWeather ' + req.body);
		} else {
			res.json({ message: 'Success' });
			logger.info('Success addWeather!');
		}
	});
};

exports.getAllStations = function (req, res) {
	database.getAllStations(function (err, stations) {
		if (err) {
			res.json({ message: 'Error' });
			logger.error('Fail getAllStations ' + err);
		} else {
			res.send(stations);
			logger.info('Success addWeather!');
		}
	});
};

var addMessagesToStation = function(result) {
	result.station.messages = result.station.messages || [];
	result.station.status = 'OFFLINE';

	if (!result.weather.length) {
		result.station.messages.push({
			message: 'Atenção: Não houve atualização dos dados nas últimas 30 horas.',
			type: 'error'
		});
	} else {
		const lastWeather = result.weather[result.weather.length - 1];
		result.station.status = new StatusService(lastWeather).getStatus();
		const timeDifferenceMs = Date.now() - lastWeather.date.getTime();
		const timeDifferenceMinutes = timeDifferenceMs / 1000.0 / 60;

		if (timeDifferenceMinutes > 15) {
			result.station.messages.push({
				message: 'Atenção: Não houve atualização dos dados recentemente.',
				type: 'warning'
			});
		}
	}

	return result;
};

exports.getStationAndWeather = function (req, res) {
	var id = req.params.id;

	var result = {};
	var returnWeather = false;
	var returnStation = false;

	database.getStation(id, function (err, station) {
		if (err) {
			res.send(result);
			logger.error('Fail getStationAndWeather-getStation ' + err);
		} else {
			result.station = station;
			returnStation = true;
			if (returnStation && returnWeather) {
				result = addMessagesToStation(result);
				res.send(result);
			}
			logger.info('Success getStationAndWeather-getStation! ');
		}
	});
	database.getWeather(id, function (err, weather) {
		if (err) {
			res.send(result);
			logger.error('Fail getStationAndWeather-getWeather ' + err);
		} else {
			result.weather = weather;
			returnWeather = true;
			if (returnStation && returnWeather) {
				result = addMessagesToStation(result);
				res.send(result);
			}
			logger.info('Success getStationAndWeather-getStation! ');
		}
	});
};

exports.getWeather = function (req, res) {
	var id = req.params.id;

	var result = {};
	database.getWeather(id, function (err, weather) {
		if (err) {
			res.send(result);
			logger.error('Fail getWeather ' + err);
		} else {
			result.weather = weather;
			res.send(result);
			logger.info('Success getWeather! ');
		}
	});
};

exports.getStationAndLastWeather = function (req, res) {
	var id = req.params.id;

	var result = {};
	var processStation = {};
	var resultStation = {};
	var returnWeather = false;
	var returnStation = false;

	var origin = req.get('origin');
	slackBot.sendMessage('New request from origin: ' + origin);

	database.getStation(id, function (err, station) {
		if (err) {
			res.send(result);
			logger.error('Fail getStationAndLastWeather-getStation ' + err);
		} else {
			processStation = station;
			resultStation.name = station.fullName;
			resultStation.country = station.location.country;
			resultStation.county = station.location.county;
			resultStation.city = station.location.city;
			resultStation.inputs = station.inputs;
			resultStation.url = 'http://pluvi.am/' + station.location.countryCode.toLowerCase() + '/' +
								station.location.countyCode.toLowerCase() + '/' +
								station.location.city.toLowerCase() + '/' +	station.urlName;
			result.station = resultStation;
			returnStation = true;
			if (returnStation && returnWeather) {
				result = joinLastWeatherAndStation(processStation, result);
				res.send(result);
			}
			logger.info('Success getStationAndLastWeather-getStation! ');
		}
	});
	database.getLastWeather(id, function (err, weather) {
		if (err) {
			res.send(result);
			logger.error('Fail getStationAndLastWeather-getLastWeather ' + err);
		} else {
			result.weather = weather;
			returnWeather = true;
			if (returnStation && returnWeather) {
				result = joinLastWeatherAndStation(processStation, result);
				res.send(result);
			}
			logger.info('Success getStationAndLastWeather-getLastWeather! ');
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
