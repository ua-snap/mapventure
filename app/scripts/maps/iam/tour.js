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
            title: 'Introduction',
            content: `
<blockquote>&ldquo;The U.S. Arctic is experiencing rapid, sustained change, and those changes are expected to continue into the coming decades due to climate change, resource extraction, and increasing human activities. Terrestrial, freshwater, and marine ecosystems as well as broader environmental, cultural, and economic trends in the Arctic will be affected.&rdquo;</blockquote>
<cite>Managing for the Future in a Rapidly Changing Arctic. A Report to the President.</cite>

<blockquote>&ldquo;The Arctic is changing rapidly, providing new opportunities and challenges.&rdquo;</blockquote>
<cite>Managing for the Future in a Rapidly Changing Arctic. A Report to the President.</cite>
`,
            onShown: function() {
              $('#step-0').css('width', '60%').center();
            }
          },
          {
            title: 'What is IAM?  Where is IAM?  Why?',
            content: `
<h3>Integrated Arctic Management (IAM)</h3>
<blockquote>&ldquo;…an &ldquo;Integrated Arctic Management&rdquo; approach holds the promise of a broader-based consideration of economic, environmental, and cultural sensitivities and trends.&rdquo;</blockquote>
<cite>Managing for the Future in a Rapidly Changing Arctic. A Report to the President.</cite>

<blockquote>&ldquo;The U.S.Arctic is a vast area that is changing rapidly while economic and social expectations are growing. This combination of factors is adding stress to a largely balkanized management system already straining to address many competing issues and priorities.&rdquo;</blockquote>
<cite>Managing for the Future in a Rapidly Changing Arctic. A Report to the President.</cite>

<p>The goal of the project was to determine where in the IAM study area ecologically, economically and culturally significant areas are located. This was done by identifying relevant and trusted existing data sources that directly relate to the analysis of important areas. <strong>The overlapping datasets were visualized to highlight areas of possible competing interests or concerns</strong>.</p>
<p>Visualizing the results of this analysis can help identify which data are available to decision-makers, denote areas of overlapping demands or concerns, and reveal significant data gaps.</p>
            `,
            onShown: function(tour) {
              $('#step-1').css('width', '60%').center();
            }
          },
          {
            title: 'IAM layers shown in this map',
            element: '.layer-menu',
            content: `
<p>The datasets were chosen by several criteria including availability of geospatial data, coverage of the IAM area and usability of the data in analysis and visualization approach. Altogether the analysis included 20 ecological layers (before 20), 8 economic layers (before 11, mile-layers removed) and 7 cultural layers (before 7).To simplify the visualization in this map, these three groups are divided into 8 categories.</p>
<h4>Ecology</h4>
<ul>
  <li><strong>Important/sensitive areas</strong> (AMSAIIC, EBSA) (2)</li>
  <li><strong>Fish</strong> (capelin, chum salmon, pink salmon, pacific herring, saffron cod, ESI fish) (6)</li>
  <li><strong>Mammals</strong> (gray whale, bowhead whale, beluga whale, spotted seal, bearded seal, ringed seal, ribbon seal, pacific walrus, polar bear, caribou) (10)</li>
<li>Birds and areas (Murre, IBA) (2)</li>
</ul>
<h4>Economic</h4>
<ul>
<li><strong>Transportation</strong> (DOT roads, shipping routes, ports, airports, infrastructure transportation) (5)</li>
<li><strong>Oil infrastructure</strong> (AK lease, wells, pipeline) (3)</li>
</ul>
<h4>Cultural</h4>
<ul><li><strong>Communities and subsistence areas</strong> (communities, villages, quiet zone, subsistence)  (4)</li>
<li><strong>Cultural and protected areas</strong> (cultural sites, cultural buildings, recreational areas) (3)</li></ul>
`,
            onShow: function() {
              //scope.$broadcast('reset-map');
            },
            onShown: function() {
              $('#step-2').css('width', '50%');
            }
          },
          {
            element: '.leaflet-marker-pane > img:first',
            title: 'Hotspots',
            content: 'These markers show areas of particular interest because many data sets overlap near these communities.  Clicking on a marker will zoom to the area and show more information.',
            onShown: function() {
              $('.leaflet-marker-pane > img').click();
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
      return tourObj;
    };

    return service;
  });
