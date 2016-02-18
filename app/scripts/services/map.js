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

    // Default URL for Geonode
    var geonodeUrl = 'http://localhost:8000';

    // Default URL for Geoserver
    var geoserverUrl = 'http://localhost:8080/geoserver/wms';

    // Default URL for Geonode API
    var geonodeApiUrl = geonodeUrl + '/api';

    // Map is populated with layers
    var ready = false;

    // Public API for configuration
    this.setGeonodeUrl = function (url) {
      geonodeUrl = url;
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
