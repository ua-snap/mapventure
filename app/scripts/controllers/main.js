'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('http://localhost:8000/api/maps')
      .success(function(data) {
        $scope.maps = data.objects;
        console.log($scope.maps);
      });
  }]);
