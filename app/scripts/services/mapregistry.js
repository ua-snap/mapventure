'use strict';

/**
 * @ngdoc service
 * @name mapventureApp.MapRegistry
 * @description
 * # MapRegistry
 * Given a UUID for a map, returns the custom
 * Angular controller to invoke for functionality.
 * If no matching UUID is found, a default controller
 * is returned (matching the maps/default/controller.js).
 */
angular.module('mapventureApp')
  .factory('MapRegistry', function() {

    // Map between GeoNode Map URI's and
    // Angular controller names.
    // Controller names will have `Ctrl` postpended
    // when attempting to instantiate the controller.
    var registry = {
      'd5a90928-2119-11e6-92e2-08002742f21f': 'AlaskaWildfires',
      '6dd7678c-5dc7-11e6-9ccd-00163edb1deb': 'Iam',
      'c5598096-7f76-11e6-9e4c-00163edb1deb': 'SnapRcp'
    };

    // Public API here
    return {
      getControllerName: function(uuid) {
        if (undefined !== registry[uuid]) {
          return registry[uuid] + 'Ctrl';
        }
        return 'DefaultMapCtrl';
      },
      getTourServiceName: function(uuid) {
        if (undefined !== registry[uuid]) {
          return registry[uuid] + 'Tour';
        }
        return 'DefaultMapTour';
      },
      // Helper function.  Look up a map's UUID from numeric ID,
      // return Controller name.
      getControllerNameById: function(id) {
        var maps = this.getMaps();
        var map = _.find(maps, function(map) { return map.id == id; });
        return this.getControllerName(map.uuid);
      },
      getMaps: function() {
        return [
          {
            abstract: 'This map shows how data from the Scenarios Network for Alaska and Arctic Planning can show variation over time with two variables: temperature and length of growing season. The tour for this map explains the meaning of this data and how to explore it in this interface, as well as where to go for additional data and examples on how to apply this data in your own work.',
            draft: true,
            id: 33,
            title: 'Variation over time with RCP 6.0 (Draft)',
            uuid: 'c5598096-7f76-11e6-9e4c-00163edb1deb'
          },
          {
            abstract: '## What areas of the Arctic are &ldquo;important&rdquo;? One challenge that managers and policy makers often face is the conflict of interests among groups. This was evident when the [Scenarios Network for Alaska and Arctic Planning](https://www.snap.uaf.edu) was asked to identify specific geographic â€œareas of environmental, economic, and cultural importanceâ€ in Arctic Alaska for a 2013 report to the President of the United states on [Integrated Arctic Management (IAM)](https://www.afsc.noaa.gov/publications/misc_pdf/iamreport.pdf). While many groups have an answer to this question, the answer depends on the perspective and interests of the group. As a proof of concept, SNAP took an objective approach to identifying important areas by displaying existing geospatial datasets that fit into the environmental, economic, and cultural categories to see where they overlap. Based upon available data, this can illustrate the relative importance of those areas, identify potential areas of conflict, and highlight gaps in Arctic geospatial data. ',
            id: 25,
            title: 'Integrated Arctic Management',
            uuid: '6dd7678c-5dc7-11e6-9ccd-00163edb1deb'
          },
          {
            abstract: 'With this tool you can see current locations and sizes of wildfires and explore them in the context of long term fire history, land cover types, and other interesting data layers. For the most current fire management information, we direct you to the following websites: * [Alaska Interagency Coordination Center (AICC)](https://fire.ak.blm.gov/) * [Current AICC Situation Report](http://fire.ak.blm.gov/content/aicc/sitreport/current.pdf) * [Alaska Wildland Fire Information](https://akfireinfo.com/) We thank the Alaska Fire Service, State of Alaska, and the Alaska Interagency Coordination Center for all their hard work fighting fires and maintaining the data!',
            id: 5,
            title: 'Alaska Wildfires: Past and Present',
            uuid: 'd5a90928-2119-11e6-92e2-08002742f21f'
          }
        ];
      }
    };
  });
