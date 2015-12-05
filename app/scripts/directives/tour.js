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
              $('#ncep_daily_air_temperature')
                .addClass('bling')
                .removeClass('no-bling');
              scope.$broadcast('show-layers', [ 'ncep_daily_air_temperature' ]);
            },
            onHide: function() {
              $('#ncep_daily_air_temperature')
                .removeClass('bling')
                .addClass('no-bling');
            }
          },
          {
            element: "#ncep_air_temperature_current_month_forecast_average .info",
            content: "Use this button to see more information about this layer, including the legend.",
            onShow: function() {
              $('#ncep_air_temperature_current_month_forecast_average .info')
                .addClass('zoom')
                .removeClass('no-zoom');
            },
            onHide: function() {
              $('#ncep_air_temperature_current_month_forecast_average .info')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          },
          {
            element: "#showMapInformation",
            content: "Use this button to show detailed information about this map, including data sources and how to obtain this data.",
            onShow: function() {
              $('#showMapInformation')
                .addClass('zoom')
                .removeClass('no-zoom');
            },
            onHide: function() {
              $('#showMapInformation')
                .removeClass('zoom')
                .addClass('no-zoom');
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

      scope.$on('start-tour', function() {
        scope.tour.restart();
      });
    }
  };
}]);
