'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('MainCtrl', ['$scope', 'MapRegistry', 'Map', function($scope, MapRegistry, Map) {
    $scope.year = new Date().getFullYear();

    // Needed for navigation between maps.
    angular.element('title').text('MapVentures: Interactive maps of Arctic data');

    var maps = MapRegistry.getMaps();
    $scope.maps = [];
    $scope.maps = _.filter(maps, function(map) {
      return !_.has(map, 'draft');
    });
  }]);
