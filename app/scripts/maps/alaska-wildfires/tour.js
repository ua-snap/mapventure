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
        onEnd: function() {
          scope.$broadcast('show-layers', ['fires_2017']);
        },
        steps: [
          {
            title: 'This season&rsquo;s fires',
            element: '#fires_2017',
            content: '<img src="images/legend3.svg"/><p>This layer shows fires that occurred or are actively burning this year.</p>',
            onShow: function() {
              $('#fires_2017')
                .addClass('bling')
                .removeClass('no-bling');
              scope.$broadcast('hide-sync-maps', []);
              scope.$broadcast('hide-dual-maps', []);
              scope.$broadcast('show-second-layers', []);
              scope.$broadcast('start-tour-dual-maps');
              scope.$broadcast('show-layers', ['fires_2017']);
            },
            onHide: function() {
              $('#fires_2017')
                .removeClass('bling')
                .addClass('no-bling');
            }
          },
          {
            title: 'Fires in history',
            element: '#fireareahistory',
            content: 'This layer shows all mapped fire perimeters from 1940 to 2016. It can be interesting to look for areas of repeated burn, or where a fire is burning today compared to older fire scars.',
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
            content: 'This layer provides a generalized view of the vegetation and type of  land at a spatial resolution of 250 meters. Vegetation types affect the flammability of an area.',
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
            content: 'Use the Info button to see more details and a legend for each layer. Try clicking this button now to see what the colors for the land cover layer mean!',
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
            title: 'How does this year compare to others?',
            element: '.js-plotly-plot .legend',
            content: 'This graph compares this year to all of the years when more than 1 million acres burned since daily records began in 2004. Are we on track for another big year?',
            placement: 'left',
            onShow: function() {
              scope.$broadcast('show-graph', []);
            },
            onHide: function() {
              scope.$broadcast('hide-graph', []);
            }
          },
          {
            title: 'End of tour!',
            orphan: true,
            content: 'Thanks for checking this out! This map is for general information only. If you need the newest information on current fires, <a target="_blank" href="http://afsmaps.blm.gov/imf_fire/imf.jsp?site=fire">visit the AICC web map</a>.  If you have feedback, we’d love to hear from you at uaf-mapventure@alaska.edu!'
          }
        ]
      });
    };

    return service;
  });
