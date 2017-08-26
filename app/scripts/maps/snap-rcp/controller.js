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
        $('<a type="button" href="https://github.com/ua-snap/data-recipes/tree/master/extract_by_polygon" target="_blank" class="info-button btn btn-primary"> <span class="glyphicon glyphicon-wrench"></span> &nbsp; How to use these data in R</a>')
          .appendTo('.mapTools');
      };

      $scope.getAbstract = function() {
        return '<h1>How might different future climates affect Alaska?</h1><div class="abstractWrapper">' +
        '<p>This map shows how temperature and length of growing season data&mdash;critical to many ecosystem processes&mdash;can vary over time within a single climate scenario (here, RCP 6.0).</p>' + '<p>The tour for this map explains what RCP 6.0 means and where to get additional data. You can also see an example of how to use the R programming language with this data for your own spatial analyses.</p></div>';
      };

      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        {
          resolutions: [4096, 2048, 1024, 512, 256, 128, 64],
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
        maxZoom: 5,
        center: [64, -165]
      };

      // Base layer configuration for pan-Arctic map.
      var baseConfiguration = {
        layers: ['arctic_osm_3572'],
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: 0
      };

      // Place names layer configuration for pan-Arctic map.
      var placeConfiguration = {
        layers: ['arctic_places_osm_3572'],
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: 100
      };

      // Return a new instance of a base layer.
      $scope.getBaseLayer = function() {
        return new L.tileLayer.wms(Map.geoserverWmsUrl(), baseConfiguration);
      };

      // Return a new instance of a placename layer.
      $scope.getPlaceLayer = function() {
        return new L.tileLayer.wms(Map.geoserverWmsUrl(), placeConfiguration);
      };

      $scope.layerOptions = function() {
        return {
          opacity: 0.8
        };
      };
    }]);
