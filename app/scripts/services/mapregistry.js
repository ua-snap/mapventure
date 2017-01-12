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
      }
    };
  });
