'use strict';

/**
 * @ngdoc service
 * @name mapventureApp.Fire
 * @description
 * # Fire
 * Handles API requests for fire data.
 */
angular.module('mapventureApp')
  .provider('Fire', function FireProvider() {
    // URL to fire features JSON endpoint
    var FEATURES_URL;

    var HISTORICAL_DATA;
    var CURRENT_DATA;

    this.setFeaturesUrl = function(path) {
      FEATURES_URL = path;
    };

    this.setHistoricalData = function(path) {
      HISTORICAL_DATA = path;
    };

    this.setCurrentData = function(path) {
      CURRENT_DATA = path;
    };

    // Method for instantiating
    this.$get = function($http) {
      return {
        // This fetches current fire positions from a GeoJSON endpoint.
        getFeatures: function() {
          return $http.get(FEATURES_URL);
        },
        // This fetches JSON daily time series data from the five historical
        // years with the most acres burned. It also fetches current acres
        // burned data for the current year and combines the historical years
        // and current year into a single dataset.
        getTimeSeries: function() {
          var historical = $http.get(HISTORICAL_DATA).then(function(res) {
            return res.data;
          }, function(err) {
            // TODO: What do we do if this fails to load?
          });

          var current = $http.get(CURRENT_DATA).then(function(res) {
            return res.data;
          }, function(err) {
            // TODO: What do we do if this fails to load?
          });

          return Promise.all([historical, current]).then(function(datasets) {
            var timeSeries = {};
            datasets.forEach(function(dataset) {
              $.extend(timeSeries, dataset);
            });
            return timeSeries;
          });
        }
      };
    };
  });
