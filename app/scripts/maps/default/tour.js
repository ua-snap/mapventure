'use strict';

/**
 * @ngdoc service
 *
 * Tour for the Default map configuration
 */
angular.module('mapventureApp')
  .factory('DefaultMapTour', function() {

    var service = {};
    service.getTour = function(scope) {
      return new Tour({
        steps: [
          {
            element: '.layer-menu',
            title: 'Map overview',
            content: 'Hello! Welcome to this map. This tour will show you around.',
            onShow: function() {
              scope.$broadcast('show-layers', []);
              scope.$broadcast('show-second-layers', []);
              scope.$broadcast('start-tour-dual-maps');
            }
          },
          {
            element: '.layer-menu .layer:first-of-type label.info',
            content: 'Use this button to see more information about this layer, including the legend.',
            onShow: function() {
              $('.layer-menu .layer:first-of-type label.info')
                .addClass('zoom')
                .removeClass('no-zoom');
            },
            onHide: function() {
              $('.layer-menu .layer:first-of-type label.info')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          },
          {
            element: '#showMapInformation',
            content: 'Use this button to show detailed information about this map, including data sources and how to obtain this data.',
            onShow: function() {
              $('#showMapInformation')
                .addClass('zoom')
                .removeClass('no-zoom');
            },
            onHide: function() {
              $('#showMapInformation')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          },
          {
            element: '#showDualMaps',
            content: 'Use this button to split the map into two maps.',
            onShow: function() {
              $('#showDualMaps')
                .addClass('zoom')
                .removeClass('no-zoom');
            }
          },
          {
            element: '#showDualMaps',
            content: 'Once clicked, additional buttons are added to the layer menu.',
            onShow: function() {
              scope.$broadcast('start-tour-dual-maps');
              scope.$broadcast('show-dual-maps', []);
            },
            onHide: function() {
              $('#showDualMaps')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          },
          {
            element: '#syncDualMaps',
            content: 'Use this button to synchronize the maps to allow for the movement on one map to be reflected on the other.',
            onShow: function() {
              $('#syncDualMaps')
                .addClass('zoom')
                .removeClass('no-zoom');
              scope.$broadcast('show-sync-maps', []);
            },
            onHide: function() {
              $('#syncDualMaps')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          },
          {
            element: '#snapmapapp',
            content: 'Try moving either map around or zoom in to see both maps synchronized.',
          },
          {
            element: '#showDualMaps',
            content: 'To return to a single map view, click on this button again.',
            onShow: function() {
              scope.$broadcast('show-dual-maps', []);
              $('#showDualMaps')
                .addClass('zoom')
                .removeClass('no-zoom');
            },
            onHide: function() {
              $('#showDualMaps')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          }
        ]
      });
    };

    return service;
  });
