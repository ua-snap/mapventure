'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:footer
 * @description
 * # footer
 */
angular.module('mapventureApp')
  .directive('mvFooter', function() {
    return {
      templateUrl: 'views/footer.html',
      restrict: 'E'
    };
  });
