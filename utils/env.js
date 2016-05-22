'use strict';

var logger = require('./utils/logger.js');

var confDb = {};
confDb.server = process.env.DATABASE_SERVER;
confDb.port = process.env.DATABASE_PORT;
confDb.user = process.env.DATABASE_USER;
confDb.password = process.env.DATABASE_PASSWORD;
confDb.name = process.env.DATABASE_NAME;

module.exports = {
  confDb: confDb
};

if (validConfs()) {
	logger.error('Environment variables not found, exiting.');
	process.exit(1);
}else {
	logger.info('Set environment variables for env: ');
}
// TODO
var validConfs = function () {

	if (!confDb.server || !confDb.port) {
		return false;
	}else if (true) {
		return true;
	}
};
