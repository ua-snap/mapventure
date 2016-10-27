'use strict';

/**
 * @ngdoc service
 *
 * Tour for the IAM Map
 */
angular.module('mapventureApp')
  .factory('SnapRcpTour', function() {
    var service = {};

    service.getTour = function(scope) {
      var tourObj = new Tour({
        orphan: true,
        steps: [
          {
            backdrop: true,
            title: 'What&rsquo;s an RCP?',
            content: '<p>The Intergovernmental Panel on Climate Change&rsquo;s (IPCC) 5th Assessment Report (AR5) describes four different potential future scenarios using Representative Concentration Pathways (RCPs).</p>' +
'<p>Each RCP represents an estimated amount of radiative forcing in the year 2100, based on anthropogenic emissions. Radiative forcing is the difference between the amount of sunlight absorbed by Earth and what&rsquo;s reflected back into space. Greenhouse gases increase this number—expressed as watts per square meter, W/m^2—because they trap heat inside the atmosphere and lead to a warmer planet.</p>' +
'<p>Each RCP has baseline starting values and estimates of emissions for the year 2100. These values are used to initialize climate models, which then allows direct comparisons between different model outputs.</p>',
            onShow: function() {
              scope.$broadcast('show-layers', []);
              scope.$broadcast('show-second-layers', []);
              scope.$broadcast('start-tour-dual-maps');
            }
          },
          {
            backdrop: true,
            title: 'What do the four RCPs describe?',
            content: '<ul>' + '<li>RCP 2.6: Radiative forcing peaks at ~3 W/m&sup2; mid-century and declines to 2.6 W/m&sup2; by 2100. Greenhouse gas emissions drop substantially over time.</li>' + '<li>RCPs 4.5 and 6.0: Radiative forcing stabilizes soon after 2100 at 4.5 and 6.0 W/m&sup2;, respectively, due to technologies and strategies that curb emissions.</li>' + '<li>RCP 8.5: Very high greenhouse gas concentrations. Radiative forcing values reach 8.5 W/m&sup2; by 2100 and continue to rise into the next century.</li>' + '</ul>'
              + '<figure><img src="images/rcp-variation.png"/><figcaption>Atmospheric concentrations of carbon dioxide, methane, and nitrous oxide for the 4 RCPs through the end of the 21st century.</figcaption></figure>',
          },
          {
            backdrop: true,
            title: 'Uncertainty in climate projections',
            content: '<p>Because estimating climate trajectories is a very uncertain business, it&rsquo;s best to look at multiple scenarios when using climate data to inform research or public policy. This approach provides the most complete picture of possible&mdash;and varying&mdash;future trends. Sometimes, however, analysis must be limited to a single RCP. In this case, the one chosen depends on the location in question and the time period for which projections are needed.</p>',

          },
          {
            backdrop: true,
            title: 'Global circulation models',
            content: '<p>Another way to deal with uncertainty is to look at global circulation models (GCMs). There are many different climate models, but SNAP has chosen the 5 that perform best over the Arctic and averaged those together to form a composite dataset that&rsquo;s statistically more robust than any individual model.</p>',
          },
          {
            backdrop: true,
            title: 'What makes SNAP data different from GCM data?',
            content: '<p>SNAP uses a process called delta downscaling to derive fine-scale spatial outputs from raw GCM data. Why? GCM data&rsquo;s coarse spatial resolution is not ideal for developing mitigation or adaptation strategies at the local landscape level. When we downscale, we take future GCM projections and subtract the GCM baseline to get an anomaly layer, or amount of change, which we resample to a 2-km pixel size. Then we add these anomalies to a 30 year average baseline climatology layer (we use PRISM and CRU) and serve the data out to the public.</p><p>Products include mean temperature, total precipitation, length of growing season, dates of freeze and thaw, seasonal totals for temperature and precipitation, and summer warmth index. Data are available as monthly, annual, and decadal averages for individual models and for our 5-model average.</p>',
          },
          {
            title: 'Side by side maps showing changing temperature',
            content: 'This is an example of a decadal average of mean annual temperature for the 2010s and 2090s. Viewed side-by-side with the same color scale, it&rsquo;s apparent how mean annual temperature is projected to increase. Increases in temperature are particularly notable in northern Alaska where the darkest blue is almost entirely replaced with lighter shades, denoting warmer temperatures.',
            onShow: function(e) {
              scope.minimized = true;
              if(false === scope.dualMaps) {
                scope.$broadcast('start-tour-dual-maps');
                scope.$broadcast('show-dual-maps', []);
              }
              scope.$broadcast('show-layers', ['tas_decadal_mean_annual_mean_c_5modelavg_rcp60_2010_2019']);
              scope.$broadcast('show-second-layers', ['tas_2090s_fixed_3572']);
              scope.$broadcast('show-sync-maps', []);
              scope.mapObj.setView(
                [-165, 75],
                2,
                {
                  reset: true
                }
              );
            }
          },
          {
            backdrop: false,
            title: 'Side by side maps showing changing growing seasons',
            content: 'A second example of a shift in climate patterns is illustrated by the Length of Growing Season layer, which is measured in days. Length of growing season is defined by the dates between when the running mean temperature crosses 0&deg;C in the spring and fall (this generally approximates the ice-free season, but hard frosts could occur even on days that are considered ice-free by this metric if the mean temperature is above 0&deg;C). Overall, by the end of the 21st century the growing season shows a strong warming trend with a longer ice-free season, most notable in the south where the growing season increases by as much as 30 days.',
            onShow: function() {
              scope.minimized = true;
              if(false === scope.dualMaps) {
                scope.$broadcast('start-tour-dual-maps');
                scope.$broadcast('show-dual-maps', []);
              }
              scope.$broadcast('show-layers', ['logs_5modelavg_rcp60_2010_2019_3857']);
              scope.$broadcast('show-second-layers', ['logs_5modelavg_rcp60_2090_2099_3572']);
              scope.$broadcast('show-sync-maps', []);
              scope.mapObj.setView(
                [-165, 75],
                2,
                {
                  reset: true
                }
              );
            }
          },
          {
            backdrop: true,
            title: 'How to get and use this data',
            content: '(TBD.  Point of this step is to encourage the user to check out individual layers and/or some buttons that may go to a Github repo and/or our CKAN instance).'
          }
        ]
      });
      return tourObj;
    };

    return service;
  });
