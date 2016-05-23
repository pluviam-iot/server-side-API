'use strict';

var logger = require('../utils/logger.js');
var util = require('../utils/util.js');

var database = {};
database.server = process.env.DATABASE_SERVER;
database.port = process.env.DATABASE_PORT;
database.user = process.env.DATABASE_USER;
database.password = process.env.DATABASE_PASSWORD;
database.name = process.env.DATABASE_NAME;

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
		logger.error('Env DATABASE_SERVER not found');
		result = false;
	}
	if (!validProperty(database.port)) {
		logger.error('Env DATABASE_PORT not found');
		result = false;
	}
	if (!validProperty(database.user)) {
		logger.error('Env DATABASE_USER not found');
		result = false;
	}
	if (!validProperty(database.password)) {
		logger.error('Env DATABASE_PASSWORD not found');
		result = false;
	}
	if (!validProperty(database.name)) {
		logger.error('Env DATABASE_NAME not found');
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
}else {
	logger.error(util.getMicrotime() + ' - Environment variables not found, exiting.');
	process.exit(1);
}
