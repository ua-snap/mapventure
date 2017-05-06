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

    this.setFeaturesUrl = function(path) {
      FEATURES_URL = path;
    };

    // Method for instantiating
    this.$get = function($http) {
      return {
        getFeatures: function() {
          return $http.get(FEATURES_URL);
        }
      };
    };
  });
