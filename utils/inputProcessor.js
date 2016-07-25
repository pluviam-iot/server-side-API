'use strict';

var logger = require('./logger.js');

var doWork = function (weather, station) {
	var result = {};
	logger.debug('weather: ' + JSON.stringify(weather));
	logger.debug('station: ' + JSON.stringify(station.inputs));
	for (var i = 0, len = station.inputs.length; i < len; i++) {
		var sensorKey = station.inputs[i].name;
		var sensorValue = weather[station.inputs[i].name];
		logger.debug('sensorValue: ' + sensorValue);
		if (sensorValue !== undefined) {
			var sensorValueProcessed = calcProcess(station.inputs[i], sensorValue);
			result[sensorKey] = sensorValueProcessed;
		}
	}
	logger.debug(JSON.stringify(result));
	return result;
};

// process and validade input values
var calcProcess = function (sensor, value) {
	if (sensor.offset) {
		value = value + sensor.offset;
	}
	if (sensor.factor) {
		value = value * sensor.factor;
	}
	if (sensor.validValues) {
		for (var i = 0, len = sensor.validValues.length; i < len; i++) {
			if (value === sensor.validValues[i]) {
				return value;
			}
		}
		return null;
	}
	if (sensor.decimalPlaces) {
		// return customRound(value, sensor.decimalPlaces);
		return parseFloat(value.toFixed(sensor.decimalPlaces));
	} else {
		return value;
	}
};

/*
not in use, must be tested extensively
var customRound = function (value, places) {
	return +(Math.round(value + 'e+' + places) + 'e-' + places);
};*/

module.exports = {
	doWork: doWork
};
