'use strict';

/**
 * @ngdoc directive
 * @name mapventureApp.directive:graph
 * @description
 * # graph
 */
angular.module('mapventureApp')
  .directive('graph', function() {
    return {
      templateUrl: 'views/graph.html',
      restrict: 'E',
      controller: ['$scope', function ($scope) {
        $scope.graphVisible = false;

        // Hard pixel values are needed to seamlessly fill <div> space.
        // This calculates the pixels based on our CSS rules:
        // .graph-screen > div {
        //   padding: 2rem;
        //   width: 80%;
        // }
        // TODO: Explore better ways to do this in future versions of Plotly.
        $scope.graphLayout = {
          width: $('body').width() * 0.8 - 64,
          height: $('body').height() * 0.8 - 64
        };

        $scope.graphOptions = {
          showLink: false,
          displayLogo: false
        };

        $scope.showGraph = function () {
          $scope.graphVisible = true;
        };

        $scope.hideGraph = function () {
          $scope.graphVisible = false;
        };
      }]
    };
  });
