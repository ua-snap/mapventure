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

    // Returns an array of layers that should be toggled
    // to a visible state upon map load.
    // TODO: refactor to use slug/UUID
    service.getDefaultLayers = function(mapId) {
      var defaultLayers = ['fire_perimeters_2016'];
      return (5 === mapId) ? defaultLayers : [];
    }

    /**
      Get CRS Function
      Purpose: Used to generate the desired coordinate reference system for a particular map
      Input: epsg_code - EPSG Code as integer value.
      Output: Returns a new Leaflet CRS object using the correct options for the input EPSG code
    */
    service.getCRS = function(epsg_code) {
      if (epsg_code === 'EPSG:3572') {
          var proj = new L.Proj.CRS('EPSG:3572',
              '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
              {
                  resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
                  origin: [0, 0]
              }
          );

          // trust me.
          // Without this (= pi/2), proj4js returns an undefined
          // value for tiles requested at the North Pole and
          // it causes a runtime exception.
          proj.projection._proj.oProj.phi0 = 1.5708;
          return proj;

      } else {
          return new L.Proj.CRS('EPSG:3338',
              '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
              {
                  resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
                  origin: [0, 0]
              }
          );
      }
    };

    // Returns additional options per map ID.
    // These override base map options specified
    // in controllers/map.js
    // This is hardcoded per map ID currently;
    // future revisions could use a slugified
    // version of the map title to return
    // per-map configurations.
    service.getMapOptions = function(mapId) {
      var mapOptions = {
        zoom: 3,
        minZoom: 3,
        maxBounds: new L.latLngBounds(
          L.latLng(72, -165),
          L.latLng(50, -145)
        )
      };

      // TODO: replace with slug or UUID
      return (5 === mapId) ? mapOptions : {};
    };

    /**
      Get Base Layer Function
      Purpose: Generates the base layer from a WMS layer provided by the input to the function.
      Definition: Base layers are non-toggleable layers used to place other layers on top of.
      Input: epsg_code - EPSG Code as integer value.
             layerUrl - Full URL to web-accessible WMS service providing our imported baselayer.
             maximumZoom - The maximum number of resolutions available from the created CRS.
      Output: Returns a new Leaflet WMS layer object created from the layerURL input.
    */
    service.getBaseLayer = function(epsg_code, layerUrl, maximumZoom) {

      // Real cheap for the moment.
      // The `epsg_code` comes from the `SRS` field of the map object
      // we get back from the MapLayers API endpoint.  It defaults
      // to 4326, and you need to use the Django admin to change it,
      // this is just a safety catch.
      if(epsg_code === 'EPSG:4326') { epsg_code = 'EPSG:3338'; }

      // When we add a 3rd map, we'll need to figure
      // out where to refactor this logic.
      // These options are merged into the options array
      // that Leaflet uses to configure the WMS layer,
      // so the names of keys matter.
      var layerConfiguration = {
        'EPSG:3572': {
          layers: 'ne_10m_coastline',
          zIndex: 10000,
          transparent: true
        },
        'EPSG:3338': {
          layers: 'MapProxy:osm',
          transparent: true
        }
      };

      var baseConfiguration = {
        format: 'image/png',
        version: '1.3',
        minZoom: 0,
        maxZoom: 18,
        continuousWorld: true, // needed for non-3857 projs
        noWrap: false, // may be needed for non-3857 projs
        zIndex: null
      };

      angular.extend(baseConfiguration, layerConfiguration[epsg_code]);

      return new L.tileLayer.wms(layerUrl, baseConfiguration);
    };
    return service;
  });
