'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('MainCtrl', ['$scope', 'Map', function($scope, Map) {

    // Needed for navigation between maps.
    angular.element('title').text('MapVentures: Interactive maps of Arctic data');

    Map.all()
      .success(function(data) {
        $scope.maps = [];
        _.each(data.objects, function(map) {
          if (map.distribution_description !== 'draft') { // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            $scope.maps.push(map);
          }
        });
      })
      .error(function(err) {
        console.log(err);
        throw('Unable to load map list!');
      });
  }]);
