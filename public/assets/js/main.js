'use strict';
/* Controllers */


var pluviamApp = angular.module('pluviamApp', ['ngRoute', 'ngMaterial']);

pluviamApp.config(function ($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('indigo');
});

pluviamApp.config(['$compileProvider', function ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
}]);

pluviamApp.config(['$routeProvider', '$locationProvider',
function ($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'home.html',
		controller: 'mainController'
	})
	.when('/about', {
		templateUrl: 'about.html',
		controller: 'aboutController'
	})
	.when('/:country/:county/:city/:stationName', {
		templateUrl: 'stations.html',
		controller: 'StationsController'
	})
	.otherwise({
		redirectTo: '/'
	});
	$locationProvider.html5Mode(true);
}]);

// create the controller and inject Angular's $scope
pluviamApp.controller('mainController', function ($scope) {
	$scope.message = 'main!';
});

pluviamApp.controller('aboutController', function ($scope) {
	$scope.message = 'Nada aqui, ainda';
});

pluviamApp.controller('StationsController', ['$scope', '$rootScope', '$http', '$routeParams', '$mdDialog', '$mdMedia',
function ($scope, $rootScope, $http, $routeParams, $mdDialog, $mdMedia) {
	console.log($routeParams);

	var API_URL_BASE = '//api.pluvi.am';
	var stationId = '';
	var paramCountry = $routeParams.country.toLowerCase();
	var paramCounty = $routeParams.county.toLowerCase();
	var paramCity = $routeParams.city.toLowerCase();
	var paramStationName = $routeParams.stationName.toLowerCase();
	$http.get(API_URL_BASE + '/stations/')
		.success(function (results, status, headers, config) {
				angular.forEach(results.stations, function (row, i) {
				console.log(row);
				if (paramCountry === row.location.countryCode.toLowerCase()) {
					console.log(paramCountry);
					if (paramCounty === row.location.countyCode.toLowerCase()) {
						console.log(paramCounty);
						if (paramCity === row.location.urlCity.toLowerCase()) {
							console.log(paramCity);
							if (paramStationName === row.urlName.toLowerCase()) {
								console.log(paramStationName);
								stationId = row.id;


								$http.get(API_URL_BASE + '/stations/' + stationId)
									.success(function (results, status, headers, config) {
										$scope.weather = results.weather[results.weather.length - 1];
										$scope.station = results.station;
										$rootScope.station = results.station;

										/*console.log("its ready?");
										while (!isGoogleChartReady){
											//console.log("notready");
										}*/
										if (true) {
											console.log('ready');

											var loader = document.getElementById('indeterminateLoader');
											var graphsDisplay = document.getElementById('graphsBase');
											// invert for each
											angular.forEach(results.station.inputs, function (row, i) {
												if (row.chartType !== 'none') {
													var dimension = row.name;
													console.log(dimension);
													var plotTogether = false;
													var rowPlotTogether = '';
													if(row.plotTogether !== '') {
														plotTogether = row.plotTogether;
														angular.forEach(results.station.inputs, function (row2, j) {
															if (row2.name === plotTogether) {
																rowPlotTogether = row2;
																console.log(rowPlotTogether);
															}
														});
												}

												graphsDisplay.insertAdjacentHTML('beforebegin', '<div flex id="' + dimension +
													'"></div>');
												var dimensionData = new google.visualization.DataTable();
												dimensionData.addColumn('datetime', 'Data/Hora');
												dimensionData.addColumn('number', row.shortName);
												if (plotTogether){
													console.log('added dimension data layer');
													dimensionData.addColumn('number', rowPlotTogether.shortName);
												}

												if (plotTogether){
													angular.forEach(results.weather, function (row, i) {
															dimensionData.addRow([(new Date(row.date)),parseFloat(row[dimension]),
																parseFloat(row[rowPlotTogether.name])]);
													});
												}else{
													angular.forEach(results.weather, function (row, i) {
														dimensionData.addRow([(new Date(row.date)),parseFloat(row[dimension])]);
													});
												}
												if (row.chartType === 'LineChart'){
													drawChart(new google.visualization.LineChart(document.getElementById(dimension)),
														row.chartColors, row.shortName + ' - ' + row.unit, dimensionData);
												}else if (row.chartType === 'ColumnChart'){
													drawChart(new google.visualization.ColumnChart(document.getElementById(dimension)),
														row.chartColors, row.shortName + ' - ' + row.unit, dimensionData);
												}else if (row.chartType === 'AreaChart'){
													drawChart(new google.visualization.AreaChart(document.getElementById(dimension)),
														row.chartColors, row.shortName + ' - ' + row.unit, dimensionData);
												}
											}
										});
									loader.style.display = 'none';
									}
								})
								.error(function(data, status, headers, config) {
								  // log error
								  console.log("fail");
								});











							}
						}
					}
				}
			});
	})
	.error(function (data, status, headers, config) {
		console.log('fail');
	}

	// $scope.$watch(function () {
	//   return $mdMedia('xs') || $mdMedia('sm');
	// }, function (responsiveClass) {
	//   $scope.responsiveClass = 'header-now-small';
 //  	})
);

	$scope.showPhotos = function (event) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
        controller: PhotosController,
        templateUrl: 'photos.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
      .then(function (answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = true;
      });
    };
	$scope.showInfos = function (event) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
        controller: InfoController,
        templateUrl: 'infos.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
      .then(function (answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = true;
      });
    };
 }

]);



function drawChart(chart, color, title, data){
	var options = {
			hAxis: {
				format: 'HH:mm'
			},
		colors:color,
		legend: {position: 'none'},
		height: 300,
		backgroundColor: '#FAFAFA',
		title: title,
		// vAxis: {minValue: 0},
		isStacked: false
		};
	chart.draw(data, options);
}


function PhotosController($scope, $rootScope, $mdDialog) {
  $scope.station = $rootScope.station;
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}

function InfoController($scope, $rootScope, $mdDialog) {
  $scope.station = $rootScope.station;
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}






/*	  function DemoCtrl ($timeout, $q, $log, $http) {
	    var self = this;
	    // list of `state` value/display objects
	    self.stations        = loadAll();
	    self.querySearch   = querySearch;
		self.selectedItemChange = selectedItemChange;
	    self.searchTextChange   = searchTextChange;

	    self.newState = newState;

	    function newState(state) {
	      alert("Sorry! You'll need to create a Constituion for " + state + " first!");
	    }

	    function querySearch (query) {
	      var results = query ? self.stations.filter( createFilterFor(query) ) : self.stations,
	          deferred;
	        return results;
	    }
	    function searchTextChange(text) {
	      $log.info('Text changed to ' + text);
	    }
	    function selectedItemChange(item) {
	      $log.info('Item changed to ' + JSON.stringify(item));
	    }

	    function loadAll() {
			var stations = [];
			$http.get('http://localhost:1337/r/stations/').
				success(function(results, status, headers, config) {
					console.log(results);
					$.each(results.stations, function (i, row) {
						var station = {};
						station.display = row.location.country + " > " +
							row.location.divisionCode + " > " + row.location.city + " > " + row.fullName;
						station.value = station.id;
						stations.push(station);
					});
				});
			return stations;
	    }
	    function createFilterFor(query) {
	      var lowercaseQuery = angular.lowercase(query);
	      return function filterFn(stations) {
	        return (stations.value.indexOf(lowercaseQuery) === 0);
	      };
	    }
	  }
	})();

*/
