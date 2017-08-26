'use strict';

/**
 * @ngdoc service
 *
 * Tour for the IAM Map
 */
angular.module('mapventureApp')
  .factory('SnapRcpTour', function($timeout) {
    var service = {};

    service.getTour = function(scope) {
      var tourObj = new Tour({
        orphan: true,
        steps: [
          {
            backdrop: true,
            title: 'What&rsquo;s an RCP?',
            content: '<p>The Intergovernmental Panel on Climate Change&rsquo;s (IPCC) 5th Assessment Report (AR5) describes four different potential future scenarios using <strong>Representative Concentration Pathways</strong> (RCPs).</p>' +
'<p>RCPs are the latest set of international climate scenarios used to model potential future climates. RCP data are used to ensure that modelers start from the same place, using values everyone is familiar with. RCPs reduce duplication, save money, and provide a &ldquo;common language&rdquo; for comparing results and sharing findings.</p>' +
'<p>Each RCP sets levels for the concentration of greenhouse gases and how much the planet has heated up for the year 2100. These become &ldquo;pathways&rdquo; to the end of the 21st century.</p>',
            onShow: function() {
              scope.$broadcast('show-layers', []);
              scope.$broadcast('show-second-layers', []);
              scope.$broadcast('start-tour-dual-maps');
            }
          },
          {
            backdrop: true,
            title: 'What do RCPs describe?',
            content:
            '<p>RCPs illustrate three major values:</p>' +
            '<ul>' +
            '<li><strong>Radiative forcing</strong>&mdash;how much sunlight is trapped in Earth’s atmosphere vs. being reflected back into space</li>' +
            '<li><strong>Emission rates</strong>&mdash;how fast we add greenhouse gases into the atmosphere</li>' +
            '<li><strong>Emission concentrations</strong>&mdash;measured in parts per million for CO2, methane, and other greenhouse gases</li>' + '</ul>' + '<p>RCP2.6, RCP4.5, RCP6, and RCP8.5 are the four major pathways. The numbers refer to levels of radiative forcings, measured in watts per square meter (W/m^2), by the year 2100.</p>' +
            '<ul>' +
            '<li><strong>RCP 2.6</strong>: Forcing peaks at ~3 W/m&sup2; mid-century and drops to 2.6 W/m&sup2; by 2100. Greenhouse gas emissions drop substantially over time.</li>' +
            '<li><strong>RCPs 4.5 and 6.0</strong>: Forcing stabilizes soon after 2100 at 4.5 and 6.0 W/m&sup2;, respectively, due to efforts that curb emissions.</li>' +
            '<li><strong>RCP 8.5</strong>: Very high greenhouse gas concentrations. Radiative forcing values reach 8.5 W/m&sup2; by 2100 and continue to rise into the next century. Very high greenhouse gas concentrations.</li>' +
            '</ul>' +
            '<figure class="text-center"><img src="images/rcp-variation.png"/><figcaption>Atmospheric concentrations of carbon dioxide, methane, and nitrous oxide for each RCP through 2100.</figcaption></figure>',
          },
          {
            backdrop: true,
            title: 'Uncertainty in climate projections',
            content: '<p>Because estimating climate trajectories is a very uncertain business, it&rsquo;s best to look at multiple scenarios when using climate data to inform research or public policy. This approach provides the most complete picture of possible&mdash;and varying&mdash;future trends. Sometimes, however, analysis must be limited to a single RCP. In this case, the one chosen depends on the location in question and the time period for which projections are needed.</p>' +
            '<figure class="text-center"><img src="images/F9.large.jpg"/><figcaption>(a) Response of the annual mean surface temperature and (b) precipitation to Special Report on Emission Scenarios A1B emissions, in 21 climate models that contributed to the IPCC Fourth Assessment Report. The solid black line is the multi-model mean.  <a target="_blank" href="http://rsta.royalsocietypublishing.org/content/369/1956/4751">Source.</a></figcaption></figure>',

          },
          {
            backdrop: true,
            title: 'Global circulation models',
            content: '<p><a target="_blank" href="https://www.gfdl.noaa.gov/climate-modeling/">Global Circulation Model (GCM) projections</a> are uncertain due to standard errors and differences in each model’s structural assumptions. To address this uncertainty, <a href="https://www.snap.uaf.edu/methods/models" target="_blank">SNAP has chosen the five that perform best over the Arctic</a> and averaged those together to form a composite dataset&mdash;an &ldquo;ensemble of opportunity&rdquo;&mdash; that is statistically more accurate than any individual model.</p>',
          },
          {
            backdrop: true,
            title: 'What makes SNAP data different from Global Circulation Model data?',
            content: '<p>Climate scientists at SNAP <a href="https://www.snap.uaf.edu/methods/downscaling" target="_blank">downscale global climate data</a> from GCMs to generate locally relevant data. Then we can connect global-scale projections with smaller-scale dynamics to create regionally specific forecasts.</p>' +
            '<figure class="text-center"><img src="images/downscaled_cru.jpg"/><figcaption>Downscaling results. Original CRU data at 0.5 x 0.5 degrees (right). At right, the same CRU data downscaled to 2 x 2 km.</figcaption></figure>',
          },
          {
            title: 'Side by side maps showing changing temperature',
            content: 'Example of a decadal average of mean annual temperature for the 2010s and 2090s. Viewed side-by-side with the same color scale, it&rsquo;s apparent that mean annual temperature is projected to increase. This is most notable in northern Alaska&mdash;where the darkest blue is almost entirely replaced with lighter shades, denoting warmer temperatures.',
            onShow: function(e) {
              scope.minimized = true;
              scope.$broadcast('show-dual-maps');
              scope.$broadcast('show-layers', ['tas_decadal_mean_annual_mean_c_5modelavg_rcp60_2010_2019']);
              scope.$broadcast('show-second-layers', ['tas_2090s_fixed_3572']);
              scope.synchronizeMaps();
              $timeout(function() {
                scope.mapObj.setView(
                  [65, -155],
                  2
                );
              }, 250);
            }
          },
          {
            backdrop: false,
            title: 'Side by side maps showing changing growing seasons',
            content: '<p>A shift in climate patterns is illustrated by the Length of Growing Season layer, which is measured in days. Length of growing season is defined by the dates between when the mean temperature passes 0&deg;C in the spring and fall.</p><p>This generally approximates the ice-free season, but hard frosts could occur even on days that are considered ice-free by this metric if the mean temperature is above 0&deg;C.</p><p>By the end of the 21st century the growing season shows a strong warming trend with a longer ice-free season.  This is most notable in the south&mdash;where the growing season increases by as much as 30 days.</p>',
            onShow: function() {
              scope.minimized = true;
              scope.$broadcast('show-dual-maps');
              scope.$broadcast('show-layers', ['logs_5modelavg_rcp60_2010_2019_3857']);
              scope.$broadcast('show-second-layers', ['logs_5modelavg_rcp60_2090_2099_3572']);
              scope.synchronizeMaps();
              $timeout(function() {
                scope.mapObj.setView(
                  [65, -155],
                  2
                );
              }, 250);
            }
          },
          {
            backdrop: true,
            title: 'How to get and use these data sets',
            content: '<h4>Get this data</h4> <p>You can <a href="http://ckan.snap.uaf.edu" target="_blank">download this and related data sets</a> from our data distribution server.</p> <h4>Using this data: spatial subsets</h4> <p>One example of how to use this data is to extract a subset of the data for a given area of interest.  <a href="https://github.com/ua-snap/data-recipes/tree/master/extract_by_polygon" target="_blank">This R script</a> can be adapted to subset a timeseries of this data for a region specified by a shapefile, producing CSV output that can the be graphed or visualized in other ways.</p>'
          }
        ]
      });
      return tourObj;
    };

    return service;
  });
