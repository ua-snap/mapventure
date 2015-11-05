'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:tour
 * @description
 * # tour
 */
var app = angular.module('mapventureApp');

app.directive('tour', ['$timeout', 'Map', function ($timeout, Map) {
  return {
    restrict: 'E',
    link: function postLink(scope) {
      scope.tour = new Tour({
        steps: [
          {
            element: ".layer-menu",
            title: "NCEP Map",
            content: "Hello! Welcome to the NCEP map. This tour will show you around.",
            onShow: function() {
              scope.$broadcast('show-layers', []);
            }
          },
          {
            element: "#ncep_daily_air_temperature",
            content: "This is the most recent temperature data from NCEP.",
            onShow: function() {
              scope.$broadcast('show-layers', [ 'ncep_daily_air_temperature' ]);
            }
          },
          {
            element: "#ncep_daily_sea_surface_temperature",
            content: "The source data set lets you choose the millibars at which you want the data, so this stuff is from sea level, the first is from 2 meters up.",
            onShow: function() {
              scope.$broadcast('show-layers', [ 'ncep_daily_sea_surface_temperature' ]);
            }
          }
        ]
      });

      scope.$watch(
        function() {
          return Map.ready();
        },
        function() {
          if(Map.ready() === true) {
            $timeout(function() {
              scope.tour.init();
              scope.tour.start();
            });
          }
        }
      );
    }
  };
}]);
