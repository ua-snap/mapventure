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
    var GEONODE_URL, GEOSERVER_URL, GEOSERVER_WMS_URL, GEONODE_API_URL;

    // Path to Leaflet image files
    var LEAFLET_IMAGE_PATH;

    // Map is populated with layers
    var ready = false;

    // Public API for configuration
    this.setGeonodeUrl = function(url) {
      GEONODE_URL = url;
      GEONODE_API_URL = GEONODE_URL + '/api';
    };

    this.setGeoserverUrl = function(url) {
      GEOSERVER_URL = url;
      GEOSERVER_WMS_URL = GEOSERVER_URL + '/wms';
    };

    this.setLeafletImagePath = function(path) {
      LEAFLET_IMAGE_PATH = path;
    };

    // Method for instantiating
    this.$get = function($http) {
      return {
        all: function() {
          return $http.get(GEONODE_API_URL + '/maps');
        },
        layers: function(mapId) {
          return $http.get(GEONODE_API_URL + '/maplayers/' + mapId);
        },
        geonodeUrl: function() {
          return GEONODE_URL;
        },
        geonodeApiUrl: function() {
          return GEONODE_API_URL;
        },
        geoserverUrl: function() {
          return GEOSERVER_URL;
        },
        geoserverWmsUrl: function() {
          return GEOSERVER_WMS_URL;
        },
        leafletImagePath: function() {
          return LEAFLET_IMAGE_PATH;
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
