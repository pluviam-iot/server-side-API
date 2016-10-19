'use strict';
/* Controllers */

/**
 * AngularJS directives for social sharing buttons - Facebook Like, Google+, Twitter and Pinterest
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.2.0
 */
(function () {
	angular.module('angulike', [])

	.directive('fbLike', ['$window', '$rootScope', function ($window, $rootScope) {
		return {
                  restrict: 'A',
                  scope: {
                      fbLike: '=?'
                  },
                  link: function (scope, element, attrs) {
                      if (!$window.FB) {
                          // Load Facebook SDK if not already loaded
                          $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
                              $window.FB.init({
                                  appId: 742272115829511,
                                  xfbml: true,
                                  version: 'v2.0'
                              });
                              renderLikeButton();
                          });
                      } else {
                          renderLikeButton();
                      }

                      var watchAdded = false;
                      function renderLikeButton () {
                          if (!!attrs.fbLike && !scope.fbLike && !watchAdded) {
                              // wait for data if it hasn't loaded yet
                              watchAdded = true;
                              var unbindWatch = scope.$watch('fbLike', function (newValue, oldValue) {
                                  if (newValue) {
                                      renderLikeButton();

                                      // only need to run once
                                      unbindWatch();
                                  }

                              });
                              return;
                          } else {
                              element.html('<div class="fb-like"' + (!!scope.fbLike ? ' data-href="' + scope.fbLike + '"' : '') + ' data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>');
                              $window.FB.XFBML.parse(element.parent()[0]);
                          }
                      }
                  }
              };
          }
      ])

      .directive('googlePlus', [
          '$window', function ($window) {
              return {
                  restrict: 'A',
                  scope: {
                      googlePlus: '=?'
                  },
                  link: function (scope, element, attrs) {
                      if (!$window.gapi) {
                          // Load Google SDK if not already loaded
                          $.getScript('//apis.google.com/js/platform.js', function () {
                              renderPlusButton();
                          });
                      } else {
                          renderPlusButton();
                      }

                      var watchAdded = false;
                      function renderPlusButton() {
                          if (!!attrs.googlePlus && !scope.googlePlus && !watchAdded) {
                              // wait for data if it hasn't loaded yet
                              watchAdded = true;
                              var unbindWatch = scope.$watch('googlePlus', function (newValue, oldValue) {
                                  if (newValue) {
                                      renderPlusButton();

                                      // only need to run once
                                      unbindWatch();
                                  }

                              });
                              return;
                          } else {
                              element.html('<div class="g-plusone"' + (!!scope.googlePlus ? ' data-href="' + scope.googlePlus + '"' : '') + ' data-size="medium"></div>');
                              $window.gapi.plusone.go(element.parent()[0]);
                          }
                      }
                  }
              };
          }
      ])

      .directive('tweet', [
          '$window', '$location',
          function ($window, $location) {
              return {
                  restrict: 'A',
                  scope: {
                      tweet: '=',
                      tweetUrl: '='
                  },
                  link: function (scope, element, attrs) {
                      if (!$window.twttr) {
                          // Load Twitter SDK if not already loaded
                          $.getScript('//platform.twitter.com/widgets.js', function () {
                              renderTweetButton();
                          });
                      } else {
                          renderTweetButton();
                      }

                      var watchAdded = false;
                      function renderTweetButton() {
                          if (!scope.tweet && !watchAdded) {
                              // wait for data if it hasn't loaded yet
                              watchAdded = true;
                              var unbindWatch = scope.$watch('tweet', function (newValue, oldValue) {
                                  if (newValue) {
                                      renderTweetButton();

                                      // only need to run once
                                      unbindWatch();
                                  }
                              });
                              return;
                          } else {
                              element.html('<a href="https://twitter.com/share" class="twitter-share-button" data-text="' + scope.tweet + '" data-url="' + (scope.tweetUrl || $location.absUrl()) + '">Tweet</a>');
                              $window.twttr.widgets.load(element.parent()[0]);
                          }
                      }
                  }
              };
          }
      ])

      .directive('pinIt', [
          '$window', '$location',
          function ($window, $location) {
              return {
                  restrict: 'A',
                  scope: {
                      pinIt: '=',
                      pinItImage: '=',
                      pinItUrl: '='
                  },
                  link: function (scope, element, attrs) {
                      if (!$window.parsePins) {
                          // Load Pinterest SDK if not already loaded
                          (function (d) {
                              var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
                              p.type = 'text/javascript';
                              p.async = true;
                              p.src = '//assets.pinterest.com/js/pinit.js';
                              p['data-pin-build'] = 'parsePins';
                              p.onload = function () {
                                  if (!!$window.parsePins) {
                                      renderPinItButton();
                                  } else {
                                      setTimeout(p.onload, 100);
                                  }
                              };
                              f.parentNode.insertBefore(p, f);
                          }($window.document));
                      } else {
                          renderPinItButton();
                      }

                      var watchAdded = false;
                      function renderPinItButton() {
                          if (!scope.pinIt && !watchAdded) {
                              // wait for data if it hasn't loaded yet
                              watchAdded = true;
                              var unbindWatch = scope.$watch('pinIt', function (newValue, oldValue) {
                                  if (newValue) {
                                      renderPinItButton();

                                      // only need to run once
                                      unbindWatch();
                                  }
                              });
                              return;
                          } else {
                              element.html('<a href="//www.pinterest.com/pin/create/button/?url=' + (scope.pinItUrl || $location.absUrl()) + '&media=' + scope.pinItImage + '&description=' + scope.pinIt + '" data-pin-do="buttonPin" data-pin-config="beside"></a>');
                              $window.parsePins(element.parent()[0]);
                          }
                      }
                  }
              };
          }
      ]);

})();


var pluviamApp = angular.module('pluviamApp', ['ngRoute', 'ngMaterial', 'angulike']);

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
	.when('/pricing', {
		templateUrl: 'pricing.html',
		controller: 'pricingController'
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
pluviamApp.controller('pricingController', function ($scope) {
	$scope.message = 'main!';
});

function DemoCtrl ($timeout, $q, $log) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled    = false;

    self.repos         = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
      var repos = [
        {
          'name'      : 'Angular 1',
          'url'       : 'https://github.com/angular/angular.js',
          'watchers'  : '3,623',
          'forks'     : '16,175',
        },
        {
          'name'      : 'Angular 2',
          'url'       : 'https://github.com/angular/angular',
          'watchers'  : '469',
          'forks'     : '760',
        },
        {
          'name'      : 'Angular Material',
          'url'       : 'https://github.com/angular/material',
          'watchers'  : '727',
          'forks'     : '1,241',
        },
        {
          'name'      : 'Bower Material',
          'url'       : 'https://github.com/angular/bower-material',
          'watchers'  : '42',
          'forks'     : '84',
        },
        {
          'name'      : 'Material Start',
          'url'       : 'https://github.com/angular/material-start',
          'watchers'  : '81',
          'forks'     : '303',
        }
      ];
      return repos.map( function (repo) {
        repo.value = repo.name.toLowerCase();
        return repo;
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(item) {
        return (item.value.indexOf(lowercaseQuery) === 0);
      };

    }
  }


pluviamApp.controller('aboutController', function ($scope) {
	$scope.message = 'Nada aqui, ainda';
});

pluviamApp.controller('StationsController', ['$scope', '$rootScope', '$http', '$routeParams', '$mdDialog', '$mdMedia', '$interval',
function ($scope, $rootScope, $http, $routeParams, $mdDialog, $mdMedia, $interval) {
	//console.log($routeParams);

	var API_URL_BASE = '//api.pluvi.am';
	var stationId = '';
	var paramCountry = $routeParams.country.toLowerCase();
	var paramCounty = $routeParams.county.toLowerCase();
	var paramCity = $routeParams.city.toLowerCase();
	var paramStationName = $routeParams.stationName.toLowerCase();
	var dimensionData = [];
	var chartList = [];
	var firstRun = true;
	callAPI();
	$interval(callAPI, 300000);
	function callAPI () {
		console.log('api called');
		$http.get(API_URL_BASE + '/stations/')
			.success(function (results, status, headers, config) {
				angular.forEach(results.stations, function (row, i) {
				//console.log(row);
				if (paramCountry === row.location.countryCode.toLowerCase()) {
					//console.log(paramCountry);
					if (paramCounty === row.location.countyCode.toLowerCase()) {
						//console.log(paramCounty);
						if (paramCity === row.location.urlCity.toLowerCase()) {
							//console.log(paramCity);
							if (paramStationName === row.urlName.toLowerCase()) {
								//console.log(paramStationName);
								stationId = row.id;
								//'/' + row.location.countryCode.toLowerCase() +
								//'/' + row.urlName.toLowerCase();

								$http.get(API_URL_BASE + '/stations/' + stationId)
									.success(function (results, status, headers, config) {
										$scope.weather = results.weather[results.weather.length - 1];
										$scope.station = results.station;
										$rootScope.station = results.station;


										// SEO
										$rootScope.seo = {
											pageTitle : 'pluviam - ' + results.station.fullName,
											canonicalUrl : 'http://pluvi.am/' + results.station.location.countryCode.toLowerCase() +
											'/' + results.station.location.countyCode.toLowerCase() +
											'/' + results.station.location.urlCity +
											'/' + results.station.urlName,
											name : results.station.fullName + ' - Estação meteorológica Pluviam'
										};


										if (true) {
											//console.log('ready');

											var loader = document.getElementById('indeterminateLoader');
											var graphsDisplay = document.getElementById('graphsBase');
											// invert for each

											angular.forEach(results.station.inputs, function (row, i) {
												if (row.chartType !== 'none') {
													var dimension = row.name;
													//console.log(dimension);
													var plotTogether = false;
													var rowPlotTogether = '';
													if(row.plotTogether !== '') {
														plotTogether = row.plotTogether;
														angular.forEach(results.station.inputs, function (row2, j) {
															if (row2.name === plotTogether) {
																rowPlotTogether = row2;
																//console.log(rowPlotTogether);
															}
														});
													}

													graphsDisplay.insertAdjacentHTML('beforebegin', '<div flex id="' + dimension +
														'"></div>');
													dimensionData[dimension] = new google.visualization.DataTable();
													dimensionData[dimension].addColumn('datetime', 'Data/Hora');
													dimensionData[dimension].addColumn('number', row.shortName);
													if (plotTogether) {
														//console.log('added dimension data layer');
														dimensionData[dimension].addColumn('number', rowPlotTogether.shortName);
													}

													if (plotTogether) {
														angular.forEach(results.weather, function (row, i) {
																dimensionData[dimension].addRow([(new Date(row.date)), parseFloat(row[dimension]),
																	row[rowPlotTogether.name]]);
														});
													} else {
														if (row.cumulative) {
															//console.log('its cumulative!');
															var cumulate = 0;
															var dimensionValue;
															var dimensionDateDay;
															var lastDimensionDate = results.weather[results.weather.length - 1].date;
															var lastDimensionDateDay = new Date(lastDimensionDate).getDate();
															angular.forEach(results.weather, function (row, i) {
																dimensionDateDay = new Date(row.date).getDate();
																//console.log(dimensionDateDay + ' - ' + lastDimensionDateDay);
																dimensionValue = row[dimension];
																dimensionData[dimension].addRow([(new Date(row.date)), dimensionValue]);
																if (dimensionDateDay === lastDimensionDateDay) {
																	cumulate += dimensionValue;
																}
															});
															$scope.weather[dimension] = parseFloat(cumulate.toFixed(1));
														} else {
															angular.forEach(results.weather, function (row, i) {
																dimensionData[dimension].addRow([(new Date(row.date)), row[dimension]]);
															});
														}
													}
													if (firstRun) {
														var chartHeigth = ($mdMedia('sm') || $mdMedia('xs')) ? 250 : 400;
														if (row.chartType === 'LineChart') {
															chartList[dimension] = new google.visualization.LineChart(document.getElementById(dimension));
														} else if (row.chartType === 'ColumnChart') {
															chartList[dimension] = new google.visualization.ColumnChart(document.getElementById(dimension));
														} else if (row.chartType === 'AreaChart') {
															chartList[dimension] = new google.visualization.AreaChart(document.getElementById(dimension));
														}
														drawChart(chartList[dimension], row.chartColors, row.shortName + ' - ' + row.unit, dimensionData[dimension], chartHeigth);
													} else {
														drawChart(chartList[dimension],
															row.chartColors, row.shortName + ' - ' + row.unit, dimensionData[dimension], chartHeigth);
													}
												}
											});
										}
										loader.style.display = 'none';
										firstRun = false;
								})
								.error(function (data, status, headers, config) {
								  // log error
								  console.log('fail');
								});

							}
						}
					}
				}
			});
		})
		.error(function (data, status, headers, config) {
			console.log('fail');
		});
	}

	// $scope.$watch(function () {
	//   return $mdMedia('xs') || $mdMedia('sm');
	// }, function (responsiveClass) {
	//   $scope.responsiveClass = 'header-now-small';
 //  	})


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



function drawChart (chart, color, title, data, height) {
	var options = {
			hAxis: {
				format: 'HH:mm'
			},
		colors: color,
		legend: {position: 'none'},
		height: height,
		backgroundColor: '#FAFAFA',
		title: title,
		animation: {
		  duration: 1000,
		  easing: 'in'
	  },
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
