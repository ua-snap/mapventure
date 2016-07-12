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
    var registry = {
      'd5a90928-2119-11e6-92e2-08002742f21f': 'AlaskaWildfiresCtrl'
    };

    // Public API here
    return {
      getController: function(uuid) {
        if (undefined !== registry[uuid]) {
          return registry[uuid];
        }
        return 'DefaultMapCtrl';
      }
    };
  });
