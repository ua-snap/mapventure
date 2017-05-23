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
      controller: ['$scope', '$window', '$timeout', function($scope, $window, $timeout) {
        $scope.graphVisible = false;
        $scope.graphLayout = $scope.graphLayout || {};

        function resizeGraph() {
          $.extend($scope.graphLayout, {
            // Hard pixel values are needed to seamlessly fill <div> space.
            // This calculates the pixels based on our Sass rules:
            //
            // .graph-screen > div {
            //   padding: 2rem;
            //   width: 80%;
            //   .graph-content {
            //     padding: 1em 2em;
            //   }
            // }
            //
            // The height of the graph description depends on screen size and
            // word wrapping, and thus needs to be grabbed dynamically.
            //
            // TODO: Explore better ways to do this in future versions of
            // plotly and angular-plotly.
            width: $('body').width() * 0.8 - 128,
            height: $('body').height() * 0.8 - 96 - $('#graph-description').height()
          });
          $scope.$apply();
        };

        // Use $watch to make sure resizeGraph() is called after the graph
        // description text is fully rendered.
        $scope.$watch('graphVisible', function() {
          $timeout(function() {
            resizeGraph();
          });
        });

        angular.element($window).bind('resize', function() {
          resizeGraph();
        });

        $scope.graphOptions = {
          showLink: false,
          displayLogo: false,
          modeBarButtonsToRemove: [
           'sendDataToCloud',
           'select2d',
           'lasso2d',
           'resetScale2d'
          ]
        };

        $scope.showGraph = function() {
          $scope.graphVisible = true;
        };

        $scope.hideGraph = function() {
          $scope.graphVisible = false;
        };
      }]
    };
  });
