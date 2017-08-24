angular.module('mapventureApp')
  .directive('mapLoadingIndicator', function() {
    return {
      templateUrl: 'views/mapLoadingIndicator.html',
      restrict: 'E'
    };
  });
