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
    // URL to fire features GeoJSON endpoint
    var FEATURES_URL;

    // URL to fire time series JSON endpoint
    var TIME_SERIES_URL;

    this.setFeaturesUrl = function(path) {
      FEATURES_URL = path;
    };

    this.setTimeSeriesUrl = function(path) {
      TIME_SERIES_URL = path;
    };

    // Method for instantiating
    this.$get = function($http) {
      return {
        // This fetches current fire positions from a GeoJSON endpoint.
        getFeatures: function() {
          return $http.get(FEATURES_URL);
        },
        // This fetches acres-burned time series data from a JSON endpoint,
        // which provides historical daily data from the most-burned years,
        // as well as the daily-updated data for the current year.
        getTimeSeries: function() {
          return $http.get(TIME_SERIES_URL).then(function(res) {
            return res.data;
          }, function(err) {
            // TODO: What do we do if this fails to load?
          });
        }
      };
    };
  });
