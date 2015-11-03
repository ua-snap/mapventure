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
    'BaseMap',
    function ($scope, $http, $routeParams, Map, BaseMap) {

    var geoserverUrl = 'http://localhost:8080/geoserver/wms';

    $scope.layers = {};

    Map.layers($routeParams.mapId)
      .success(function(data) {
        $scope.map = data;
        $scope.addLayers();

        $scope.crs = BaseMap.getCRS($scope.map.srid);

        $scope.baselayer = BaseMap.getBaseLayer($scope.map.srid, geoserverUrl);

        $scope.mapObj = L.map('snapmapapp', {
          center: [65, -150],
          zoom: 1,
          crs: $scope.crs,
          scrollWheelZoom: false,
          zoomControl: false,
          layers: [
            $scope.baselayer
          ]
        });

        new L.Control.Zoom({ position: 'topright' }).addTo($scope.mapObj);

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
  }]);
