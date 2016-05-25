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
    'slugifier'
  ])
  .config(function ($routeProvider, MapProvider, ENV) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/map/:mapId', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map'
      })
      .otherwise({
        redirectTo: '/'
      });

      if (ENV.geonode_url === undefined) {
        // Set the default GeoNode URL here if environment variable isn't set during Grunt build
        MapProvider.setGeonodeUrl('http://localhost:8000');
      } else {
        MapProvider.setGeonodeUrl(ENV.geonode_url);
      }

      if (ENV.geoserver_url === undefined) {
        // Set the default Geoserver URL here if environment variable isn't set during Grunt build
        MapProvider.setGeoserverUrl('http://localhost:8080/geoserver');
      } else {
        MapProvider.setGeoserverUrl(ENV.geoserver_url);
      }
  });
