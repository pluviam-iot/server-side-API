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
	apiCalls.frontEndStationAndWeather = 0;
	apiCalls.frontEndWeather = 0;
	apiCalls.frontEndStationAndWeatherLast = 0;
};

module.exports = {
	apiCalls: apiCalls,
	apiCallsReset: apiCallsReset
};
