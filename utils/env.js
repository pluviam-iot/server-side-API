'use strict';

var logger = require('../utils/logger.js');
var util = require('../utils/util.js');

var database = {};
database.server = process.env.DATABASE_URL;

var environment = process.env.NODE_ENV;

module.exports = {
	database: database,
	environment: environment
};

var validConfs = function () {
	var result = true;
	if (!validProperty(environment)) {
		logger.error('Env NODE_ENV not found');
		result = false;
	}
	if (!validProperty(database.server)) {
		logger.error('Env DATABASE_URL not found');
		result = false;
	}
	return result;
};

var validProperty = function (value) {
	if (value === undefined || value === '' || value === null) {
		return false;
	}
	return true;
};

if (validConfs()) {
	logger.info(util.getMicrotime() + ' - All environment variables found, continuing');
	logger.info(util.getMicrotime() + ' - Environment set: ' + environment);
} else {
	logger.error(util.getMicrotime() + ' - Environment variables not found, exiting.');
	process.exit(1);
}
