'use strict';

/**
 * @ngdoc service
 * @name mapventureApp.Map
 * @description
 * # Map
 * Handles API requests for maps.
 */
angular.module('mapventureApp') 
  .provider('Map', function MapProvider() {
    // Creates the variables for holding the URL for
    // Geonode, Geoserver, and Geonode API.
    var geonodeUrl, geoserverUrl, geonodeApiUrl;

    // Map is populated with layers
    var ready = false;

    // Public API for configuration
    this.setGeonodeUrl = function (url) {
      geonodeUrl = url;
      geonodeApiUrl = geonodeUrl + '/api';
    };

    this.setGeoserverUrl = function (url) {
      geoserverUrl = url;
    };

    // Method for instantiating
    this.$get = function ($http) {
      return {
        all: function() {
          return $http.get(geonodeApiUrl + '/maps');
        },
        layers: function(mapId) {
          return $http.get(geonodeApiUrl + '/maplayers/' + mapId);
        },
        geonodeUrl: function() {
          return geonodeUrl;
        },
        geoserverUrl: function() {
          return geoserverUrl;
        },
        setReady: function(isReady) {
          ready = isReady;
        },
        ready: function() {
          return ready;
        }
      };
    };
  });
