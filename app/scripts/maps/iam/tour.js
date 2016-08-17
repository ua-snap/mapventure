'use strict';

/**
 * @ngdoc service
 *
 * Tour for the Default map configuration
 */
angular.module('mapventureApp')
  .factory('IamTour', function() {
    var service = {};
    service.getTour = function(scope) {
      var tourObj = new Tour({
        orphan: true,
        steps: [
          {
            title: 'The IAM study area',
            content: `
The IAM study area covers a subset of the northern Arctic within US jurisdiction. The Bering Strait region and the Chukchi and Beaufort seas are characterized by diminishing seasonal sea ice and are thus vulnerable to significant changes. This tool allows you to explore some of the environmental, economic, and cultural geospatial data available in the study area. Areas with overlapping datasets highlight zones of overlapping, and potentially competing, interests or concerns.
`,
            onShown: function() {
              $('#step-0')
                .css('width', '60%')
                .center()
                .css('margin-top', '12rem');
            },
            onShow: function() {
              scope.$broadcast('show-layers', []);
              scope.$broadcast('show-second-layers', []);
            }
          },
          {
            title: 'What does this map show?',
            element: '.layer-menu',
            content: `
<p>Data layers are grouped in the legend by:</p>

<h4>Environmental</h4>
<ul><li>Sensitive areas (2 datasets)</li><li>Fish (6)</li><li>Mammals (10)</li><li>Birds (2)</li></ul>

<h4>Economic</h4>
<ul><li>Transportation (5)</li><li>Oil infrastructure (3)</li></ul>

<h4>Cultural</h4>
<ul><li>Communities and subsistence areas (4)</li><li>Cultural and recreational  areas (3)</li></ul>
`,
            onShown: function() {
              $('.layer-menu').css('background-color', '#DAEE88');
            },
            onHide: function() {
              $('.layer-menu').css({
                'background-color': 'rgba(255, 255, 255, .75)'
              });
            }
          },
          {
            title: 'How to get more information',
            element: '.layer-menu .layer:first-of-type label.info',
            content: 'You can see a list of all included datasets by clicking this button. You can read about the dataset and find out where to get more information.',
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
            element: '.tourMarker',
            title: 'Overlapping areas',
            content: `
Data layers are semi-transparent. Overlapping data layers become darker and darker shades of color. The darker the area the more layers are overlapping which indicates a &ldquo;hot spot&rdquo;.`,
            onShow: function() {
              scope.showLayer('mammals');
              scope.mapObj.setView([
                66.43771036250584,
                -162.61488740208168
              ], 3);
              $('.tourMarker').css('display', 'block');
            },
            onHide: function() {
              scope.hideLayer('mammals');
              $('.tourMarker').css('display', 'none');
              scope.setDefaultView();
            }
          },
          {
            element: '.leaflet-marker-pane > img:first',
            title: 'Hotspots',
            content: `
The highest amount of overlapping data is shown in darkest shade. These areas indicate the highest number of environmental, economic and cultural features at a location. A few hot spots were identified based on the amount of layers overlapping in the area. By selecting a hot spot from the map you can zoom in and see which datasets are present there.`,
            onShow: function() {
              scope.showLayer('fish');
              scope.showLayer('cult_rec');
              scope.showLayer('trans');
              scope.mapObj.setView(
                [63.333802, -170.039820],
                4
              );
            },
            onHide: function() {
              scope.hideLayer('fish');
              scope.hideLayer('cult_rec');
              scope.hideLayer('trans');
              scope.setDefaultView();
            }
          }
        ]
      });
      return tourObj;
    };

    return service;
  });
