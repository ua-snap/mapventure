'use strict';

/**
 * @ngdoc service
 *
 * Tour for the Default map configuration
 */
angular.module('mapventureApp')
  .factory('AlaskaWildfiresTour', function() {

    var service = {};
    service.getTour = function(scope) {
      return new Tour({
        steps: [
          {
            element: '.layer-menu',
            title: 'Introduction',
            content: 'This map shows locations and extents of significant wildfires from this summer. It also includes data that are useful for comparison with current fires.',
            onShow: function() {
              scope.$broadcast('show-layers', []);
              scope.$broadcast('show-second-layers', []);
              scope.$broadcast('start-tour-dual-maps');
            }
          },
          {
            title: 'This season&rsquo;s fires',
            element: '#active_fires',
            content: 'This map uses hourly data from the Alaska Interagency Coordination Center and shows only fires that have mapped perimeters. If you want to see every fire, check out the <a href="http://afsmaps.blm.gov/imf_fire/imf.jsp?site=fire" target="_blank">AICC’s web map</a>.',
            onShow: function() {
              $('#active_fires')
                .addClass('bling')
                .removeClass('no-bling');
              scope.$broadcast('show-layers', ['active_fires']);
            },
            onHide: function() {
              $('#active_fires')
                .removeClass('bling')
                .addClass('no-bling');
            }
          },
          {
            title: 'Fires in history',
            element: '#fireareahistory',
            content: 'This layer shows all mapped fire perimeters 1940&mdash;2015.  It can be interesting to look for areas of repeated burn, or where a fire is burning today compared to older fire scars.',
            onShow: function() {
              $('#fireareahistory')
                .addClass('bling')
                .removeClass('no-bling');
              scope.$broadcast('show-layers', ['fireareahistory']);
            },
            onHide: function() {
              scope.$broadcast('show-layers', []);
              $('#fireareahistory')
                .removeClass('bling')
                .addClass('no-bling');
            }
          },
          {
            title: 'Land cover from 2010',
            element: '#alaska_landcover_2010',
            content: 'Land cover classifications are used by scientists to determine what is growing on the landscape. These are made by looking at satellite imagery and categorizing the images into landcover types.',
            onShow: function() {
              $('#alaska_landcover_2010')
                .addClass('bling')
                .removeClass('no-bling');
              scope.$broadcast('show-layers', ['alaska_landcover_2010']);
            },
            onHide: function() {
              scope.$broadcast('show-layers', []);
              $('#alaska_landcover_2010')
                .removeClass('bling')
                .addClass('no-bling');
            }
          },
          {
            title: 'What do the colors mean?',
            element: '#alaska_landcover_2010 .info',
            content: 'Use the Info button to see more details and a legend for each layer.  Try clicking this button now to see what the colors for the land cover layer mean!',
            onShow: function() {
              $('#alaska_landcover_2010 .info')
                .addClass('zoom');
              scope.$broadcast('show-layers', ['alaska_landcover_2010']);
            },
            onHide: function() {
              scope.$broadcast('show-layers', []);
              $('#alaska_landcover_2010 .info')
                .removeClass('zoom');
            }
          },
          {
            title: 'Two maps at the same time',
            element: '#showDualMaps',
            content: 'Use this button to split the map into two maps, each with its own layers.  This makes it possible to compare areas between the maps.',
            onShow: function() {
              $('#showDualMaps')
                .addClass('zoom')
                .removeClass('no-zoom');
            },
            onHide: function() {
              $('#showDualMaps')
                .removeClass('zoom')
                .addClass('no-zoom');
            }
          },
          {
            title: 'Comparing maps',
            element: '#minimize-layer-div',
            content: 'With two maps active, you can see fires in the context of landscape and history.  You can use this button to hide the layers, making it easy to see both maps.',
            onShow: function() {
              scope.$broadcast('start-tour-dual-maps');
              scope.$broadcast('show-dual-maps', []);
              scope.$broadcast('show-second-layers', ['alaska_landcover_2010']);
              scope.$broadcast('show-layers', ['fireareahistory']);
            },
            onShown: function() {
              scope.$broadcast('show-sync-maps', []);
              scope.minimized = true;
            },
            onHide: function() {

            }
          },
          {
            title: 'End of tour!',
            orphan: true,
            content: 'Thanks for checking this out!  This map is for general information only. If you need the newest information on current fires, <a href="http://afsmaps.blm.gov/imf_fire/imf.jsp?site=fire" target="_blank">visit the AICC web map</a>.',
            onShow: function() {
              scope.minimized = false;
            },
            onShown: function() {
              scope.$broadcast('hide-sync-maps', []);
              scope.$broadcast('hide-dual-maps', []);
              scope.$broadcast('show-layers', ['fireareahistory']);
              scope.$broadcast('show-layers', ['active_fires']);
            },
            onHide: function() {
            }
          }
        ]
      });
    };

    return service;
  });
