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

    // Default URL for Geonode API
    var geonodeApiUrl = 'http://localhost:8000/api';

    // Map is populated with layers
    var ready = false;

    // Public API for configuration
    this.setGeonodeApiUrl = function (url) {
      geonodeApiUrl = url;
    };

    this.getGeonodeApiUrl = function() {
      return geonodeApiUrl;
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
        setReady: function(isReady) {
          ready = isReady;
        },
        ready: function() {
          return ready;
        }
      };
    };
  });
