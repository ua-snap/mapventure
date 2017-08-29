'use strict';

// Will be updated by `grunt-version` task to current version in package.json
var version = '1.15.0';

/**
 * @ngdoc overview
 * @name mapventureApp
 * @description
 * # mapventureApp
 *
 * Main module of the application.
 */
var app = angular
  .module('mapventureApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngDialog',
    'ui.sortable',
    'ui.bootstrap',
    'config',
    'angularMoment',
    'markdown',
    'plotly',
    'ng.deviceDetector',
    'angular-google-analytics'
  ])
  .config(function($routeProvider, MapProvider, FireProvider, AnalyticsProvider, ENV) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/map/:mapId', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map'
      })
      .when('/fires', {
        redirectTo: '/map/5'
      }).otherwise({
        redirectTo: '/'
      });

    if (ENV.GEOSERVER_URL === undefined) {
      // Set the default Geoserver URL here if environment variable isn't set during Grunt build
      MapProvider.setGeoserverUrl('http://localhost:8080/geoserver');
    } else {
      MapProvider.setGeoserverUrl(ENV.GEOSERVER_URL);
    }

    if (ENV.LEAFLET_IMAGE_PATH === undefined) {
      // Set the default Leaflet image path here if environment variable isn't set during Grunt build
      MapProvider.setLeafletImagePath('bower_components/leaflet/dist/images');
    } else {
      MapProvider.setLeafletImagePath(ENV.LEAFLET_IMAGE_PATH);
    }

    if (ENV.FIRE_FEATURES_URL === undefined) {
      // Set the default fire features URL here if environment variable isn't set during Grunt build
      FireProvider.setFeaturesUrl('http://aicc-fire-api.openshift.snap.uaf.edu/');
    } else {
      FireProvider.setFeaturesUrl(ENV.FIRE_FEATURES_URL);
    }

    if (ENV.FIRE_TIME_SERIES_URL === undefined) {
      // Set the default fire time series URL here if environment variable isn't set during Grunt build
      FireProvider.setTimeSeriesUrl('http://aicc-fire-api.openshift.snap.uaf.edu/fire-time-series');
    } else {
      FireProvider.setTimeSeriesUrl(ENV.FIRE_TIME_SERIES_URL);
    }

    if (ENV.GOOGLE_ANALYTICS_TOKEN) {
      AnalyticsProvider.setAccount(ENV.GOOGLE_ANALYTICS_TOKEN);
    } else {
      AnalyticsProvider.startOffline(true);
    }
  })
  .run(['Analytics', function(Analytics) {}]);

app.value('version', version);
