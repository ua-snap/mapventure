'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:footer
 * @description
 * # footer
 */
angular.module('mapventureApp')
  .directive('mvFooter', ['version', function() {
    return {
      templateUrl: 'views/footer.html',
      restrict: 'E',
      controller: ['$scope', 'version', function($scope, version) {
        $scope.version = version;
        $scope.year = new Date().getFullYear();
      }]
    };
  }]);
