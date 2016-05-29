'use strict';

var logger = require('./logger.js');

var doWork = function (weather, station) {
	var result = {};
	logger.debug('weather: ' + JSON.stringify(weather));
	logger.debug('station: ' + JSON.stringify(station.inputs));
	for (var i = 0, len = station.inputs.length; i < len; i++) {
		var sensorKey = station.inputs[i].name;
		var sensorValue = weather[station.inputs[i].name];
		if (sensorValue) {
			var sensorValueProcessed = calcProcess(station.inputs[i], sensorValue);
			result[sensorKey] = sensorValueProcessed;
		}
	}
	logger.debug(JSON.stringify(result));
	return result;
};

// process and validade input values
var calcProcess = function (sensor, value) {
	if (sensor.factor && sensor.offset) {
		value = value * sensor.factor;
		value = value + sensor.offset;
	}else if (sensor.validValues) {
		for (var i = 0, len = sensor.validValues.length; i < len; i++) {
			if (value === sensor.validValues[i]) {
				return value;
			}
		}
		return null;
	}
	return value;
};

module.exports = {
  doWork: doWork
};