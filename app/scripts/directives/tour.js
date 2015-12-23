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
          },
          {
            element: "#showDualMaps",
            content: "Use this button to split the map into two maps.",
            onShow: function() {
              $('#showDualMaps')
                .addClass('zoom')
                .removeClass('no-zoom');
            }
          },
          {
            element: "#showDualMaps",
            content: "Once clicked, additional buttons are added to the layer menu.",
            onShow: function() {
              scope.$broadcast('show-dual-maps', []);
            },
            onHide: function() {
              $('#showDualMaps')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          },
          {
            element: "#syncDualMaps",
            content: "Use this button to synchronize the maps to allow for the movement on one map to be reflected on the other.",
            onShow: function() {
              $('#syncDualMaps')
                .addClass('zoom')
                .removeClass('no-zoom');
              scope.$broadcast('show-sync-maps', []);
            },
            onHide: function() {
              $('#syncDualMaps')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          },
          {
            element: "#snapmapapp",
            content: "Try moving either map around or zoom in to see both maps synchronized.",
          },
          {
            element: "#ncep_yearly_air_temperature",
            content: "This is the temperature data from NCEP for a year ago today. With two maps, we can choose which map to display the data on. The left map is controlled by the left buttons, and the right map is controller by the right buttons.",
            onShow: function() {
              $('#ncep_yearly_air_temperature')
                .addClass('bling')
                .removeClass('no-bling');
              scope.$broadcast('show-second-layers', [ 'ncep_yearly_air_temperature' ]);
            },
            onHide: function() {
              $('#ncep_yearly_air_temperature')
                .removeClass('bling')
                .addClass('no-bling');
            }
          },
          {
            element: "#showDualMaps",
            content: "If wishing to return to a single map view, click on this button again.",
            onShow: function() {
              scope.$broadcast('show-dual-maps', []);
              $('#showDualMaps')
                .addClass('zoom')
                .removeClass('no-zoom');
            },
            onHide: function() {
              $('#showDualMaps')
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
