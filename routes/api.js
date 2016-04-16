var database = require('../models/database.js');

exports.addWeather = function (req, res) {
	var weather = req.body;
	var stationId = req.params.id;
	var hashFromReq = req.get('X-Pluviam-Token');
	database.addWeather(stationId, hashFromReq, weather, function (err, success) {
		if (err) {
			res.json({ message: 'Error' });
			console.log('fail addWeather' + err);
		}else {
			console.log('Success addWeather!');
			res.json({ message: 'Sucess' });
		}
	});
};

exports.getAllStations = function (req, res) {
	database.getAllStations(function (err, stations) {
		if (err) {
			res.json({ message: 'Error' });
			console.log('fail');
		} else {
			res.send(stations);
		}
	});
};

exports.getWeather = function (req, res) {
	var id = req.params.id;
	console.log('Retrieving beehive: ' + id);

	var result = {};
	var returnWeather = false;
	var returnStation = false;

	database.getStation(id, function (err, station) {
		if (err) {
			res.send(result);
			console.log(err.stack || err);
		} else {
			result.station = station;
			returnStation = true;
			console.log('Success!');
			if (returnStation && returnWeather) {
				res.send(result);
			}
		}
	});
	database.getWeather(id, function (err, weather) {
		if (err) {
			// either fs.readFile or fs.writeFile returned an error
			console.log(err.stack || err);
		} else {
			result.weather = weather;
			returnWeather = true;
			console.log('Success!');
			if (returnStation && returnWeather) {
				res.send(result);
			}
		}
	});
};
