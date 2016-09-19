'use strict';

/**
 * @ngdoc service
 *
 * Tour for the IAM Map
 */
angular.module('mapventureApp')
  .factory('IamTour', function() {
    var service = {};

    // Convenience function to center
    // tour steps with extra width and
    // no target element.
    jQuery.fn.center = function() {
      this.css('position','absolute');
      this.css('top', Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + 'px');
      this.css('left', Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + 'px');
      return this;
    };

    service.getTour = function(scope) {
      var tourObj = new Tour({
        orphan: true,
        steps: [
          {
            title: 'The IAM study area',
            content: '\
<p>The IAM study area covers a subset of the northern Arctic within US jurisdiction. The Bering Strait region and the Chukchi and Beaufort seas are characterized by diminishing seasonal sea ice and are thus vulnerable to significant changes. This tool allows you to explore some of the environmental, economic, and cultural geospatial data available in the study area.</p>\
<p>Areas with overlapping datasets highlight zones of overlapping, and potentially competing, interests or concerns.</p>\
',
            onShown: function() {
              scope.setDefaultView();
              try {
                scope.mapObj.addLayer(scope.iamPoly);
              } catch (e) {
                // Ignore.  This can happen
                // if the user reloads the
                // page after being on this step
                // of the tour -- edge case to fix
                // another time.
              }
              $('#step-0')
                .css('width', '50%')
                .center()
                .css('margin-top', '10rem');
            },
            onShow: function() {
              scope.$broadcast('show-layers', []);
              scope.$broadcast('show-second-layers', []);
            },
            onHide: function() {
              scope.mapObj.removeLayer(scope.iamPoly);
            }
          },
          {
            title: 'Layers and datasets / What does this map show?',
            element: '.layer-list',
            content: '\
<p>Each layer contains multiple datasets grouped by:</p>\
<h4>Environmental</h4>\
<ul><li>Signficant ecological areas</li><li>Mammals</li><li>Birds</li><li>Fish</li></ul>\
<h4>Economic</h4>\
<ul><li>Transportation</li><li>Oil infrastructure</li></ul>\
<h4>Cultural</h4>\
<ul><li>Communities and subsistence areas</li><li>Cultural and protected areas</li></ul>'
,
            onShown: function() {
              $('.layer-list').css('background-color', '#DAEE88');
            },
            onHide: function() {
              $('.layer-list').css({
                'background-color': 'rgba(255, 255, 255, .75)'
              });
            }
          },
          {
            title: 'Information about the datasets',
            element: '.layer-menu .layer:first-of-type label.info',
            content: 'Click this button to see a list of all included datasets. This provides a short description of the dataset and shows where to get more information.',
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
            content: 'Datasets are semi-transparent. The more datasets that overlap, the darker the area.',
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
            content: 'We identified “hot spots” as locations with the greatest number of overlapping environmental, economic, and cultural datasets. Three example hot spots are shown on the map. Selecting a marker zooms in and lists the datasets at that location.',
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
