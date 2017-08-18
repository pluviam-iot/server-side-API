'use strict';
var apiCalls = {};
// /r
apiCalls.backendAPIRoot = 0;
// /b
apiCalls.frontEndAPIRoot = 0;
// /r/stations/
apiCalls.frontEndAllStations = 0;
// /b/stations/:id
apiCalls.backEndStationAddWeather = 0;
// /r/stations/:id
apiCalls.backEndBulkStationAddWeather = 0;
// /r/stations/:id/bulk
apiCalls.frontEndStationAndWeather = 0;
// /r/stations/:id/weather
apiCalls.frontEndWeather = 0;
// /r/stations/:id/last
apiCalls.frontEndStationAndWeatherLast = 0;

var apiCallsReset = function () {
	apiCalls.backendAPIRoot = 0;
	apiCalls.frontEndAPIRoot = 0;
	apiCalls.frontEndAllStations = 0;
	apiCalls.backEndStationAddWeather = 0;
	apiCalls.backEndBulkStationAddWeather = 0;
	apiCalls.frontEndStationAndWeather = 0;
	apiCalls.frontEndWeather = 0;
	apiCalls.frontEndStationAndWeatherLast = 0;
};

var buildStats = function () {
	return '\nbackendAPIRoot ' + apiCalls.backendAPIRoot +
		'\nbackEndStationAddWeather ' + apiCalls.backEndStationAddWeather +
		'\nbackEndBulkStationAddWeather ' + apiCalls.backEndBulkStationAddWeather +
		'\nfrontEndAPIRoot ' + apiCalls.frontEndAPIRoot +
		'\nfrontEndAllStations ' + apiCalls.frontEndAllStations +
		'\nfrontEndStationAndWeather ' + apiCalls.frontEndStationAndWeather +
		'\nfrontEndWeather ' + apiCalls.frontEndWeather +
		'\nfrontEndStationAndWeatherLast ' + apiCalls.frontEndStationAndWeatherLast;
};

module.exports = {
	apiCalls: apiCalls,
	apiCallsReset: apiCallsReset,
	buildStats: buildStats
};
