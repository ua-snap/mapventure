'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('MapCtrl', function ($scope) {

    var crs = new L.Proj.CRS('EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
      {
        resolutions: [
          8192, 4096, 2048, 1024, 512, 256, 128
        ],
        origin: [0, 0]
      });

    angular.extend($scope, {
      center: {
        lat: 65,
        lng: -150,
        zoom: -2
      },
      defaults: {
        crs: crs,
        scrollWheelZoom: false
      },
      layers: {
        baselayers: {

            mapbox_light: {
                name: 'Mapbox Light',
                url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                type: 'xyz',
                layerOptions: {
                  apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
                  mapid: 'bufanuvols.lia22g09',
                  maxZoom: crs.options.resolutions.length,
                  minZoom: 0,
                  continuousWorld: true
                }
            },
            osm: {
                name: 'OpenStreetMap',
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                type: 'xyz',
                layerOptions: {
                  maxZoom: crs.options.resolutions.length,
                  minZoom: 0,
                  continuousWorld: true
                }
            },
            natural_earth: {
              name: "Natural Earth",
              url: 'http://geonode-test.iarc.uaf.edu/geoserver/wms',
              layerOptions: {
                maxZoom: crs.options.resolutions.length,
                minZoom: 0,
                continuousWorld: true,
                layers: 'natural_earth_base',
                format: 'image/png',
                version: '1.3'
              },
              type: 'wms'
            }
        }
      }
    });

  });
