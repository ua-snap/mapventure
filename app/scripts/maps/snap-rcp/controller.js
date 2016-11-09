'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:IamCtrl
 * @description
 * # IAM Ctrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('SnapRcpCtrl', [
    '$scope',
    'Map',
    '$http',
    function($scope, Map, $http) {

      // Default layers are switched to Visible after
      // the map has loaded.
      $scope.defaultLayers = [];

      // Called after the data has been loaded,
      // this function can be used to modify & hook into
      // map events.  $scope is inherited from the parent
      // scope (Controllers/Map).  mapObj and secondMapObj
      // are both instances of Leaflet maps.
      $scope.onLoad = function(mapObj, secondMapObj) {

      };

      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        {
          resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
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
        zoom: 1,
        minZoom: 0,
        maxZoom: 5,
        center: [64, -165]
      };

      // Base layer configuration for pan-Arctic map.
      var baseConfiguration = {
        layers: ['geonode:ne_10m_coastline'],
        transparent: true,
        format: 'image/png',
        version: '1.3',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: null
      };

      // Return a new instance of a base layer.
      $scope.getBaseLayer = function() {
        return new L.tileLayer.wms(Map.geoserverWmsUrl(), baseConfiguration);
      };

      $scope.layerOptions = function() {};
    }]);
