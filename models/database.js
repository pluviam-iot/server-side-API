var mongo = require('mongodb');
var config = require('config');
var util = require('../lib/util.js');

var Server = mongo.Server;
var	Db = mongo.Db;

var databasePort = config.get('server.database.port');
var databaseServer = config.get('server.database.server');

var databaseName = config.get('server.database.name');
var collectionWeather = config.get('server.database.collectionWeather');
var collectionStations = config.get('server.database.collectionStations');

var server = new Server(databaseServer, databasePort, {auto_reconnect: true});
var db = new Db(databaseName, server);

db.open(function (err, db) {
	if (err) {
		console.log('Error connecting to database ' + databaseName);
	}else {
		console.log('Connected to ' + databaseName + 'database');
		db.collection(collectionWeather, {strict: true}, function (err, collection) {
			if (err) {
				console.log('Collection ' + collectionWeather + ' not found!');
			}else {
				console.log('Successful connection to ' + collectionWeather + '!');
			}
		});
		db.collection(collectionStations, {strict: true}, function (err, collection) {
			if (err) {
				console.log('Collection ' + collectionStations + ' not found!');
			}else {
				console.log('Successful connection to ' + collectionStations + '!');
			}
		});
	}
});

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
			callback(new Error('collection get'));
			return;
		}
		collection.findOne({'_id': new mongo.ObjectId(stationId)}, function (err, item) {
			if (err) {
				callback(new Error('collection findOne'));
				return;
			}else {
				if (util.isNotEmpty(item)) {
					if (util.isEmpty(item.internal.password) || util.isEmpty(item.internal.salt) || util.isEmpty(hashFromReq)) {
						callback(new Error('empty identify string'));
						return;
					}
					if (!util.isValidPassword(item.internal.password, item.internal.salt, hashFromReq)) {
						callback(new Error('invalid password'));
						return;
					}
					// TODO validate object and properties and make conversions
					weather.stationId = item._id;
					console.log('weather date ' + weather.date);
					if (typeof weather.date === 'undefined' || weather.date === null) {
						weather.date = new Date().toISOString();
					}
					db.collection(collectionWeather, function (err, collection) {
						if (err) {
							callback(new Error('error db.collection'));
							return;
						}
						collection.insert(weather, {safe: true}, function (err, result) {
							if (err) {
								callback(new Error('error'));
								return;
							} else {
								console.log('Adding weather: ' + JSON.stringify(weather));
								console.log('Success collection.insert');
								callback(null, 'success collection.insert');
							}
						});
					});
				}else {
					callback(new Error('error item is empty'));
					return;
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
