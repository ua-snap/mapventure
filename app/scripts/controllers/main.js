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
    Map.all()
      .success(function(data) {
        $scope.maps = data.objects;
      })
      .error(function(err) {
        console.log(err);
        throw('Unable to load map list!');
      });
  }]);
