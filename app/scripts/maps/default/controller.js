'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:DefaultCtrl
 * @description
 * # DefaultCtrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('DefaultMapCtrl', [
    '$scope',
    'Map',
    function($scope, Map) {

      /* Definition section.

      If you are creating new custom behavior for a map,
      copy/paste these items into a new map controller
      and customize as required.

      */

      // Default layers are switched to Visible after
      // the map has loaded.
      $scope.defaultLayers = [];

      // Crs is an L.Proj.CRS instance object.
      $scope.crs = undefined;

      // Map options used to instantiate the Leaflet map.
      // http://leafletjs.com/reference.html#map-class
      $scope.mapOptions = {};

      // Returns a base layer (will not show up in
      // list of layers, cannot be turned on/off).
      // Expected to be an instance of a Leaflet object
      // implementing the ILayer interface -- basically
      // any normal layer type.
      // http://leafletjs.com/reference.html#ilayer
      $scope.getBaseLayer = function() {
        return undefined;
      };

      // Used to specify a layer of place names
      // that will be kept at the highest z-index to keep
      // it above any data that is displayed.  If
      // this function returns null or undefined,
      // it isn't instantiated.  Otherwise, it needs
      // to be a Leaflet layer.
      $scope.getPlaceLayer = function() {
        return undefined;
      };

      // Called after the data has been loaded,
      // this function can be used to modify & hook into
      // map events.  $scope is inherited from the parent
      // scope (Controllers/Map).  mapObj and secondMapObj
      // are both instances of Leaflet maps.
      $scope.onLoad = function(mapObj, secondMapObj) {};

      // This hook is used to modify the specific
      // layer parameters that are generated when
      // requesting a layer from the server.
      // Should return an object with properties
      // to merge/override into the layer request.
      $scope.layerOptions = function() {};

      /* End definition section.

      Below we provide a default pan-arctic view & base layer.

      */

      // Note that the default configuration is
      // being used.
      console.info('Using default map controller.');

      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        {
          resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],

          // Origin should be lower-left coordinate
          // in projected space.  Use GeoServer to
          // find this:
          // TileSet > Gridset Bounds > compute from maximum extent of SRS
          origin: [-4234288.146966308, -4234288.146966307]
        }
      );

      // trust me.
      // Without this (= pi/2), proj4js returns an undefined
      // value for tiles requested at the North Pole and
      // it causes a runtime exception.
      proj.projection._proj.oProj.phi0 = 1.5708;
      $scope.crs = proj;

      // General options for Leaflet configuration.
      $scope.mapOptions = {
        zoom: 0,
        minZoom: 0,
        maxZoom: 5
      };

      // Base layer configuration for pan-Arctic map.
      var baseConfiguration = {
        layers: 'geonode:ne_10m_coastline',
        transparent: true,
        format: 'image/png',
        version: '1.3',
        tiled: 'true',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: null
      };

      // Return a new instance of a base layer.
      $scope.getBaseLayer = function() {
        return new L.tileLayer.wms(Map.geoserverWmsUrl(), baseConfiguration);
      };

    }]);
