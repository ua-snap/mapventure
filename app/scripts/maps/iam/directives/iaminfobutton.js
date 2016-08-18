'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:maps/iam/iamInfo
 * @description
 * # maps/iam/iamInfo
 */
angular.module('mapventureApp')
  .directive('iamInfoButton', function() {
    return {
      templateUrl: 'scripts/maps/iam/views/iamInfoButton.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
