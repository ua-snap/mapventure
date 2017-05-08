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
        },
        getTimeSeries: function(year) {
          return $http.get('/' + year + '.json');
        },
        getHighestYears: function(years, numberOfYears) {
          // Pair each year with its total acres burned (last day of data).
          // Create an array of these pairings (an array of arrays) for sorting
          // in the next step.
          var yearsWithArea = years.map(function(year) {
            return $http.get('/' + year + '.json').then(function(res) {
              return [year, res.data.acres.slice(-1)[0]];
            });
          });

          // Wait for all the HTTP requests / pairings to complete in the
          // previous step before sorting our array of arrays.
          return Promise.all(yearsWithArea).then(function(yearAreaArray) {
            // Sort in descending order.
            yearAreaArray.sort(function(a, b) {
              return b[1] - a[1];
            });

            // With the pairings now sorted, return a new array of just the
            // sorted years without their acres burned values.
            var sortedYears = yearAreaArray.map(function(yearWithArea) {
              return yearWithArea[0];
            });

            // Return a subset of sorted years.
            return sortedYears.slice(0, numberOfYears);
          });
        }
      };
    };
  });
