'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('MapCtrl', [
    '$scope',
    '$http',
    '$routeParams',
    'Map',
    function ($scope, $http, $routeParams, Map) {

    var geoserverUrl = 'http://localhost:8080/geoserver/wms';

    $scope.crs = new L.Proj.CRS('EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
      {
        // This bit of magic came from a guide I found online and should be considered suspicious.
        // TODO, figure out what the resolutions mean in the context of this code.
        // GH#65
        resolutions: [
          8192, 4096, 2048, 1024, 512, 256, 128
        ],
        origin: [0, 0]
      });

    $scope.mapObj = L.map('snapmapapp', {
      center: [65, -150],
      zoom: 1,
      crs: $scope.crs,
      scrollWheelZoom: false,
      zoomControl: false,
      layers: [
        L.tileLayer.wms(geoserverUrl, {
          continuousWorld: true,
          maxZoom: $scope.crs.options.resolutions.length,
          minZoom: 0,
          layers: 'natural_earth_base',
          format: 'image/png',
          version: '1.3'
        })
      ]
    });

    $scope.sidebar = L.control.sidebar('info-sidebar',
      {
        position: 'left'
      }
    );
    $scope.mapObj.addControl($scope.sidebar);

    new L.Control.Zoom({ position: 'topright' }).addTo($scope.mapObj);

    $scope.layers = {};

    Map.layers($routeParams.mapId)
      .success(function(data) {
        $scope.map = data;
        $scope.addLayers();
      });

    $scope.addLayers = function() {
      angular.forEach($scope.map.layers, function(layer) {

        // Strip the 'geonode:' prefix, not sure how that's used in
        // GeoExplorer or MapLoom's versions of things.
        layer.name = layer.name.replace('geonode:','');
        $scope.layers[layer.name] = {};
        $scope.layers[layer.name].obj = L.tileLayer.wms(geoserverUrl,
          {
            continuousWorld: true,
            layers: layer.name,
            name: layer.name,
            transparent: true,
            format: 'image/png',
            version: '1.3',
            visible: false
          }
        );
      });
    };

    $scope.toggleLayer = function(layerName) {
      if( false === $scope.mapObj.hasLayer( $scope.layers[layerName].obj)) {
        $scope.layers[layerName].obj.addTo($scope.mapObj);
        $scope.layers[layerName].visible = true;
      } else {
        $scope.mapObj.removeLayer($scope.layers[layerName].obj);
        $scope.layers[layerName].visible = false;
      }
    };

    $scope.showLayerInformation = function(layerName) {
      var layer = _.find($scope.map.layers, function(layer) {
        return layer.name === layerName;
      });
      $http.get('http://localhost:8000/api/layers/' + layer.id)
      .success(function(data) {
        var legendGraphic = '<h1>Legend</h1><img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER='+layerName+'" alt="legend" />';
        var converter = new showdown.Converter();
        $scope.sidebar.setContent(legendGraphic + converter.makeHtml(data.abstract)).show();
      });
    };

  }]);
