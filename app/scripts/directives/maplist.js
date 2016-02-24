'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:mapList
 * @description
 * # mapList
 */
angular.module('mapventureApp')
  .directive('mapList', function () {
    return {
      templateUrl: 'views/mapList.html',
      restrict: 'E',
      controller: ['$scope', '$location', function($scope, $location) {
        $scope.viewMap = function(mapId) {
          $location.path('/map/' + mapId);
        };
      }]
    };
  });
