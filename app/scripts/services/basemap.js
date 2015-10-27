'use strict';

/**
 * @ngdoc service
 * @name mapventureApp.BaseMap
 * @description
 * # BaseMap
 * Factory in the mapventureApp.
 */
angular.module('mapventureApp')
  .factory('BaseMap', function () {

    var service = {};

    service.getProjCRS = function(epsg_code) {
      if (epsg_code == 3338) {
          return new L.Proj.CRS('EPSG:3338',
              '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
              {
                  resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
                  origin: [0, 0]
              }
          );
      } else if (epsg_code == 3413) {
          return new L.Proj.CRS('EPSG:3413',
              '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
              {
                  resolutions: [8192,4096, 2048, 1024, 512, 256, 128],
                  origin: [0, 0]
              }
          );
      }
    };

    return service;
  });
