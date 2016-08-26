'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:menuToggle
 * @description
 * # menuToggle
 */
angular.module('mapventureApp')
  .directive('menuToggle', function() {
    return {
      templateUrl: 'views/menuToggle.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
