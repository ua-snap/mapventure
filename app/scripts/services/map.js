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
    // Creates the variables for holding the URL for GeoServer.
    var GEOSERVER_URL, GEOSERVER_WMS_URL;

    // Path to Leaflet image files
    var LEAFLET_IMAGE_PATH;

    // Map is populated with layers
    var ready = false;

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
