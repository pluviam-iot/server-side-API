'use strict';

var logger = require('../utils/logger.js');
var mongo = require('mongodb');
var config = require('config');
var util = require('../utils/util.js');

var collectionWeather = config.get('server.database.collectionWeather');
var collectionStations = config.get('server.database.collectionStations');

var assert = require('assert');

// var env = require('../utils/env.js');

var inputProcessor = require('../utils/inputProcessor.js');

var MongoClient = require('mongodb').MongoClient;
var db;
var databaseURL = 'mongodb://madalozzo:C0nnect123@localhost:27017/pluviam';
MongoClient.connect(databaseURL, function (err, connection) {
	assert.equal(null, err);
	logger.info(util.getMicrotime() + ' - Connected to DB server.');
	db = connection;
	verifyCollections();
});

function verifyCollections () {
	db.collection(collectionWeather, {strict: true}, function (err, collection) {
		if (err) {
			logger.error('Collection ' + collectionWeather + ' not found!');
			process.exit(1);
		}else {
			logger.info(util.getMicrotime() + ' - Successful connection to ' + collectionWeather + '!');
		}
	});
	db.collection(collectionStations, {strict: true}, function (err, collection) {
		if (err) {
			logger.error('Collection ' + collectionStations + ' not found!');
			process.exit(1);
		}else {
			logger.info(util.getMicrotime() + ' - Successful connection to ' + collectionStations + '!');
		}
	});
}

exports.getStationFull = function (stationId, callback) {
	console.log('getStationFull - id: ' + stationId);
	db.collection(collectionStations, function (err, collection) {
		if (err) {
			console.log('getStationFull fail id ' + stationId);
			callback('error getting station');
		}
		collection.findOne({'_id': new mongo.ObjectId(stationId)}, function (err, station) {
			if (err) {
				console.log('getStationFull fail id ' + stationId);
				callback('error getting station');
			}
			console.log(station);
			callback(null, station);
		});
	});
};

exports.getWeather = function (stationId, callback) {
	var result = [];
	db.collection(collectionWeather, function (err, collection) {
		if (err) {
			console.log('getWeather fail id ' + stationId);
			callback('error db.collection');
		}
		collection.find({'stationId': new mongo.ObjectId(stationId)}).sort({date: 1}).toArray(function (err, items) {
			if (err) {
				console.log('getWeather fail id ' + stationId);
				return result;
			}
			console.log('items found');
			items.forEach(function (item) {
				var weather = {};
				weather.temperature = item.temperature;
				weather.humidity = item.humidity;
				weather.precipitation = item.precipitation;
				weather.pressure = item.pressure;
				weather.brightness = item.brightness;
				var wind = {};
				var windSpeed = {};
				windSpeed.gust = item.wind.speed.gust;
				windSpeed.speed = item.wind.speed.speed;
				wind.speed = windSpeed;
				wind.direction = item.wind.direction;
				wind.degree = item.wind.degree;
				weather.wind = wind;
				weather.date = item.date;
				result.push(weather);
			});
			callback(null, result);
		});
	});
};

exports.getAllStations = function (callback) {
	var stations = [];
	var result = {};
	db.collection(collectionStations, function (err, collection) {
		if (err) {
			console.log('faillll');
		}
		collection.find({
			'internal.sandbox': false,
			'internal.private': false,
			'internal.unlisted': false
		}).toArray(function (err, items) {
			if (err) {
				console.log('faillll');
			}
			items.forEach(function (item) {
				var station = {};
				station.id = item._id;
				station.fullName = item.station.fullName;
				station.name = item.station.name;
				station.location = item.station.location;
				station.location.coordinates = undefined;
				stations.push(station);
			});

			result.stations = stations;
			callback(null, result);

		});
	});
};

exports.addWeather = function (stationId, hashFromReq, weather, callback) {
	console.log('Getting station for ' + stationId + ' ' + hashFromReq);
	db.collection(collectionStations, function (err, collection) {
		if (err) {
			return callback(new Error('collection get'));
		}
		collection.findOne({'_id': new mongo.ObjectId(stationId)}, function (err, station) {
			if (err) {
				return callback(new Error('collection findOne'));
			}else {
				if (util.isNotEmpty(station)) {
					if (!station.internal.token || !station.internal.salt || !hashFromReq) {
						return callback(new Error('empty identify string'));
					}
					if (!util.isValidToken(station.internal.token, station.internal.salt, hashFromReq)) {
						return callback(new Error('invalid password'));
					}
					var processedWeather = inputProcessor.doWork(weather, station);
					processedWeather.stationId = station._id;
					console.log('weather date ' + weather.date);
					if (typeof weather.date === 'undefined' || weather.date === null) {
						processedWeather.date = new Date().toISOString();
					}else {
						processedWeather.date = weather.date;
					}
					db.collection(collectionWeather, function (err, collection) {
						if (err) {
							return callback(new Error('error db.collection'));
						}
						collection.insert(processedWeather, {safe: true}, function (err, result) {
							if (err) {
								return callback(new Error('error'));
							} else {
								console.log('Adding weather: ' + JSON.stringify(processedWeather));
								console.log('Success collection.insert');
								return callback(null, 'success collection.insert');
							}
						});
					});
				}else {
					return callback(new Error('error item is empty'));
				}
			}
		});
	});
};

exports.getStation = function (stationId, callback) {
	console.log('getStation - id: ' + stationId);
	this.getStationFull(stationId, function (err, station) {
		if (err) {
			callback('error getting station');
			return;
		} else {
			station.internal = undefined;
			callback(null, station);
			return;
		}
	});
};

exports.closeConnections = function (callback) {
	db.close();
	callback(null);
	return;
};
