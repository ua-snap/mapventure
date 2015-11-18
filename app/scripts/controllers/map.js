'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the mapventureApp
 */
var app = angular.module('mapventureApp')

app.controller('MapCtrl', [
  '$scope',
  '$http',
  '$routeParams',
  '$timeout',
  'Map',
  'BaseMap',
  function ($scope, $http, $routeParams, $timeout, Map, BaseMap) {
    $timeout(function() {
      var geoserverUrl = 'http://localhost:8080/geoserver/wms';
      $scope.layers = {};

      Map.layers($routeParams.mapId).success(function(data) {
        $scope.map = data;
        $scope.crs = BaseMap.getCRS($scope.map.srid);
        $scope.baselayer = BaseMap.getBaseLayer($scope.map.srid, geoserverUrl);
    
        // The splash screen should be on until Map is loaded.
        $scope.splashHide = false;

        // This variable must be set to be watched or else the Leaflet event does not update the 
        // ngHide function properly.
        $scope.$watch('splashHide');

        // This checks for the 'load' event from Leaflet which means that the basemap 
        // has completely loaded.
        $scope.baselayer.on("load", function() { $scope.splashHide = true; $scope.$apply(); });

        $scope.addLayers();

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

        $scope.sidebar = L.control.sidebar('info-sidebar', {
          position: 'left'
        });
        $scope.mapObj.addControl($scope.sidebar);

        new L.Control.Zoom({ position: 'topright' }).addTo($scope.mapObj);

        $scope.sortableOptions = {
          stop: function() {
            for(var i = 0; i < $scope.map.layers.length; i++) {
              $scope.layers[$scope.map.layers[i].name].obj.setZIndex(i);
            }
          }
        };
      });

      $scope.addLayers = function() {
        angular.forEach($scope.map.layers, function(layer) {
          // Strip the 'geonode:' prefix, not sure how that's used in
          // GeoExplorer or MapLoom's versions of things.
          layer.name = layer.name.replace('geonode:','');
          $scope.layers[layer.name] = {};
          $scope.layers[layer.name].obj = L.tileLayer.wms(geoserverUrl, {
            continuousWorld: true,
            layers: layer.name,
            name: layer.name,
            transparent: true,
            format: 'image/png',
            version: '1.3',
            visible: false
          });
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
        $http.get('http://localhost:8000/api/layers/' + layer.id).success(function(data) {
          var legendGraphic = '<h1>Legend</h1><img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER='+layerName+'" alt="legend" />';
          var converter = new showdown.Converter();
          $scope.sidebar.setContent(legendGraphic + converter.makeHtml(data.abstract)).show();
        });
      };
    });
  }
]);
