/* global: Tour */
'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:tour
 * @description
 * # Tour directive
 * Invokes the correct code implementing the tour
 * for the map specified from the MapRegistry,
 * and wires up some listeners to manage the tour state.
 */
var app = angular.module('mapventureApp');

app.directive('tour', [
  '$timeout',
  'Map',
  '$injector',
  'MapRegistry',
  function($timeout, Map, $injector, MapRegistry) {
  return {
    restrict: 'E',
    link: function postLink(scope) {
      scope.$watch(
        function() {
          return Map.ready();
        },
        function() {
          if (Map.ready() === true) {

            var tour = $injector.get(MapRegistry.getTourServiceName(scope.map.uuid));
            scope.tour = tour.getTour(tour);

            $timeout(function() {
              scope.tour.init();
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
