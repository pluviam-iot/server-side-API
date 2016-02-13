var mongo = require('mongodb');
var config = require('config');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var databasePort = config.get('server.database.port');
var databaseServer = config.get('server.database.server');

var databaseName = config.get('server.database.name');
var collectionWeather = config.get('server.database.collectionWeather');
var collectionStations = config.get('server.database.collectionStations');

var server = new Server(databaseServer, databasePort, {auto_reconnect: true});
var db = new Db(databaseName, server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to " + databaseName + " database");
		db.collection(collectionWeather, {strict:true}, function(err, collection) {
			if (err) {
				console.log("Collection " + collectionWeather + " not found!" );
			}
		});
		db.collection(collectionStations, {strict:true}, function(err, collection) {
			if (err) {
				console.log("Collection " + collectionStations + " not found!" );
			}
		});
	}
});


exports.addWeather = function(req, res) {
	var bee = req.body;
	stationToken = req.get('X-Pluviam-Token');
	stationId = req.get('X-Pluviam-Id');
	console.log("Getting honeycomb for " + stationToken + " " + stationId);
	db.collection(collectionWeather, function(err, collection) {
		collection.findOne({'internal.token': stationId, 'internal.password': stationToken}, function(err, item) {
			if (err) {
				console.log("faillll");
			}else{
				if (typeof item != 'undefined' && item){
					//TODO validate object and properties and make conversions
					bee.stationId = item._id;
					console.log("bee date " + bee.date);
					if (typeof bee.date == 'undefined' || bee.date === null){
						bee.date = new Date().toISOString();
					}
					db.collection(collectionStations, function(err, collection) {
						collection.insert(bee, {safe:true}, function(err, result) {
							if (err) {
								res.send({success: false });
							} else {
								console.log('Adding bee: ' + JSON.stringify(bee));
								console.log('Success');
								res.send({success: true });
							}
						});
					});
				}else{
					res.send({success: false });
				}
			}
		});
	});
};


exports.getWeather = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving beehive: ' + id);
	var weather = [];

	db.collection(collectionWeather, function(err, collection) {
		collection.findOne({"_id":new mongo.ObjectId(id)}, function(err, station){

			db.collection(collectionStations, function(err, collection) {
				collection.find({"stationId":new mongo.ObjectId(id)}).sort({date : 1}).toArray(function(err, items) {
					if (err) {
						console.log("faillll");
					}
					items.forEach(function(item) {
						console.log("item");
						var bee = {};
						bee.temperature = item.temperature;
						bee.humidity = item.humidity;
						bee.precipitation = item.precipitation;
						bee.pressure = item.pressure;
						bee.brightness = item.brightness;
						var wind = {};
						var windSpeed = {};
						windSpeed.gust = item.wind.speed.gust;
						windSpeed.speed = item.wind.speed.speed;
						wind.speed = windSpeed;
						wind.direction = item.wind.direction;
						wind.degree = item.wind.degree;
						bee.wind = wind;
						bee.date = item.date;
						weather.push(bee);
					});
					var result = {};
					result.weather = weather;
					result.station = station;
					res.send(result);
				});
			});
		});
	});
};


exports.getStations = function(req, res) {
	var beehives = [];
	db.collection(collectionWeather, function(err, collection) {
		collection.find({
			"internal.sandbox":false,
			"internal.private": false,
			"internal.unlisted": false
		}).toArray(function(err, items) {
			if (err) {
				console.log("faillll");
			}
			items.forEach(function(item) {
				var beehive = {};
				beehive.id = item._id;
				beehive.fullName = item.station.fullName;
				beehive.name = item.station.name;
				beehive.location = item.station.location;
				beehive.location.coordinates = undefined;
				beehives.push(beehive);
			});
			var result = {};
			result.stations = beehives;
			res.send(result);
		});
	});
};
