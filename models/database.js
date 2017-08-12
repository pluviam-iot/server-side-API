'use strict';

var logger = require('../utils/logger.js');
var mongo = require('mongodb');
var config = require('config');
var util = require('../utils/util.js');

var collectionWeather = config.get('server.database.collectionWeather');
var collectionStations = config.get('server.database.collectionStations');

var assert = require('assert');

var envs = require('../utils/env.js');

var inputProcessor = require('../utils/inputProcessor.js');

var MongoClient = require('mongodb').MongoClient;
var db;
var databaseURL = envs.database.server;
MongoClient.connect(databaseURL, function (err, connection) {
	assert.equal(null, err);
	logger.info(util.getMicrotime() + ' - Connected to DB server.');
	db = connection;
	verifyCollections();
});

function verifyCollections () {
	db.collection(collectionWeather, {strict: true}, function (err, collection) {
		if (err) {
			logger.error('Collection ' + collectionWeather + ' not found! Exiting.');
			process.exit(1);
		} else {
			logger.info(util.getMicrotime() + ' - Successful connection to ' + collectionWeather + '!');
		}
	});
	db.collection(collectionStations, {strict: true}, function (err, collection) {
		if (err) {
			logger.error('Collection ' + collectionStations + ' not found! Exiting.');
			process.exit(1);
		} else {
			logger.info(util.getMicrotime() + ' - Successful connection to ' + collectionStations + '!');
		}
	});
}

exports.getStationFull = function (stationId, callback) {
	db.collection(collectionStations, function (err, collection) {
		if (err) {
			return callback(new Error('Error getStationFull - db.collection'));
		}
		collection.findOne({'_id': new mongo.ObjectId(stationId)}, function (err, station) {
			if (err) {
				return callback(new Error('Error getting station - findOne'));
			} else if (station) {
				return callback(null, station);
			} else {
				return callback(new Error('Station not found'));
			}
		});
	});
};

exports.getWeather = function (stationId, callback) {
	var result = [];
	db.collection(collectionWeather, function (err, collection) {
		if (err) {
			return callback(new Error('Error getWeather - db.collection'));
		}
		// 30 hours in milliseconds
		var calcDate = Date.now();
		calcDate -= 108000000;
		calcDate = new Date(calcDate);
		var start_date = new Date(calcDate);
		// logger.info('start_date ' + start_date);
		collection.find({ 'stationId': new mongo.ObjectId(stationId), 'date': {'$gte': new Date(start_date)} }).sort({date: 1}).toArray(function (err, items) {
			if (err) {
				return callback(new Error('Station not found'));
			}
			items.forEach(function (item) {
				var weather = {};
				weather.temperature = item.temperature;
				weather.humidity = item.humidity;
				weather.precipitation = item.precipitation;
				weather.pressure = item.pressure;
				weather.brightness = item.brightness;
				weather.windGust = item.windGust;
				weather.windSpeed = item.windSpeed;
				weather.windDirection = item.windDirection;
				weather.date = item.date;
				result.push(weather);
			});
			return callback(null, result);
		});
	});
};

exports.getLastWeather = function (stationId, callback) {
	var result = {};
	db.collection(collectionWeather, function (err, collection) {
		if (err) {
			return callback(new Error('Error getLastWeather - db.collection'));
		}
		// 30 hours in milliseconds
		var today = new Date();
		var start_date = today.getFullYear() + '-' + (parseInt(today.getMonth()) + 1) + '-' + today.getDate();
		collection.find({ 'stationId': new mongo.ObjectId(stationId), 'date': {'$gte': new Date(start_date)} }).sort({date: 1}).toArray(function (err, items) {
			if (err) {
				return callback(new Error('Error getLastWeather - collection.find'));
			}
			result.precipitation = 0;
			if (items.length !== 0) {
				result.precipitation = 0;
				items.forEach(function (item) {
					result.precipitation += parseFloat(item.precipitation);
				});
				result.precipitation = parseFloat(result.precipitation.toFixed(1));
				var lastItem = items.length - 1;
				result.temperature = items[lastItem].temperature;
				result.humidity = items[lastItem].humidity;
				result.pressure = items[lastItem].pressure;
				result.brightness = items[lastItem].brightness;
				result.windGust = items[lastItem].windGust;
				result.windSpeed = items[lastItem].windSpeed;
				result.windDirection = items[lastItem].windDirection;
				result.date = items[lastItem].date;
			}
			return callback(null, result);
		});
	});
};

exports.getAllStations = function (callback) {
	var stations = [];
	var result = {};
	db.collection(collectionStations, function (err, collection) {
		if (err) {
			return callback(new Error('Error getAllStations - db.collection'));
		}
		collection.find({
			'internal.sandbox': false,
			'internal.private': false,
			'internal.unlisted': false
		}).toArray(function (err, items) {
			if (err) {
				return callback(new Error('Error getAllStations - collection.find'));
			}
			items.forEach(function (item) {
				var station = {};
				station.id = item._id;
				station.fullName = item.fullName;
				station.urlName = item.urlName;
				station.location = item.location;
				station.location.coordinates = undefined;
				stations.push(station);
			});

			result.stations = stations;
			return callback(null, result);
		});
	});
};

exports.addWeather = function (stationId, hashFromReq, weather, callback) {
	db.collection(collectionStations, function (err, collection) {
		if (err) {
			return callback(new Error('Error addWeather - db.collection(collectionStations)'));
		}
		collection.findOne({'_id': new mongo.ObjectId(stationId)}, function (err, station) {
			if (err) {
				return callback(new Error('Error addWeather - collection.findOne'));
			} else {
				if (util.isNotEmpty(station)) {
					if (!station.internal.token || !station.internal.salt || !hashFromReq) {
						return callback(new Error('Error addWeather - empty identify strings'));
					}
					if (!util.isValidToken(station.internal.token, station.internal.salt, hashFromReq)) {
						return callback(new Error('Error addWeather - invalid password'));
					}
					var processedWeather = inputProcessor.doWork(weather, station);
					processedWeather.stationId = station._id;
					if (typeof weather.date === 'undefined' || weather.date === null) {
						processedWeather.date = new Date();
					} else {
						processedWeather.date = new Date(weather.date);
					}
					db.collection(collectionWeather, function (err, collection) {
						if (err) {
							return callback(new Error('Error addWeather - db.collection(collectionWeather)'));
						}
						collection.insert(processedWeather, {safe: true}, function (err, result) {
							if (err) {
								return callback(new Error('Error addWeather - collection.insert'));
							} else {
								logger.info('Adding weather: ' + JSON.stringify(processedWeather));
								return callback(null, 'Success collection.insert');
							}
						});
					});
				} else {
					return callback(new Error('Error addWeather - item empty'));
				}
			}
		});
	});
};

exports.getStation = function (stationId, callback) {
	this.getStationFull(stationId, function (err, station) {
		if (err) {
			return callback(new Error('Error getStation - getStationFull'));
		}
		station.internal = undefined;
		return callback(null, station);
	});
};

exports.closeConnections = function (callback) {
	db.close();
	return callback(null);
};
