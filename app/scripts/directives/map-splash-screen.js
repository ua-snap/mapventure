'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:mapSplashScreen
 * @description
 * # mapSplashScreen
 */
angular.module('mapventureApp')
  .directive('mapSplashScreen', function () {
    return {
      templateUrl: 'views/mapSplashScreen.html',
      restrict: 'E'
    };
  });
