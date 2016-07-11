'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the mapventureApp
 */

var app = angular.module('mapventureApp');

app.controller('MapCtrl', [
  '$scope',
  '$controller',
  function($scope, $controller) {
    console.log(app);
    var mapController = $controller(
      'AlaskaWildfiresCtrl',
      { $scope: $scope });
    console.log('hello');
  }
]);
