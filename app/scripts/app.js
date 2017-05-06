'use strict';

/**
 * @ngdoc overview
 * @name mapventureApp
 * @description
 * # mapventureApp
 *
 * Main module of the application.
 */
angular
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
    'plotly'
  ])
  .config(function($routeProvider, MapProvider, FireProvider, ENV) {
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
      .otherwise({
        redirectTo: '/'
      });

    if (ENV.GEONODE_URL === undefined) {
      // Set the default GeoNode URL here if environment variable isn't set during Grunt build
      MapProvider.setGeonodeUrl('http://localhost:8000');
    } else {
      MapProvider.setGeonodeUrl(ENV.GEONODE_URL);
    }

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
      FireProvider.setFeaturesUrl('http://mv-aicc-fire-shim-mv-aicc-fire-shim.openshift.snap.uaf.edu/');
    } else {
      FireProvider.setFeaturesUrl(ENV.FIRE_FEATURES_URL);
    }
  });
