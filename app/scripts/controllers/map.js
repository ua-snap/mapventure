'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:MapCtrl
 * @description
 * # MapCtrl
 * Controller of the mapventureApp
 */
var app = angular.module('mapventureApp');

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
        $scope.baselayer = BaseMap.getBaseLayer($scope.map.srid, geoserverUrl,$scope.crs.options.resolutions.length);

        $scope.secondcrs = BaseMap.getCRS($scope.map.srid);
        $scope.secondbaselayer = BaseMap.getBaseLayer($scope.map.srid, geoserverUrl,$scope.secondcrs.options.resolutions.length);

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

        $scope.secondMapObj = L.map('secondmap', {
          center: [65, -150],
          zoom: 1,
          crs: $scope.secondcrs,
          scrollWheelZoom: false,
          zoomControl: false,
          layers: [
            $scope.secondbaselayer
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
              $scope.layers[$scope.map.layers[i].name].obj.setZIndex($scope.map.layers.length - i);
            }
          }
        };
        $scope.mapObj.sync($scope.secondMapObj);
        $scope.secondMapObj.sync($scope.mapObj);
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
        Map.setReady(true);
      };

      $scope.showLayer = function(layerName) {
          $scope.layers[layerName].obj.addTo($scope.mapObj);
          $scope.layers[layerName].visible = true;
      };

      $scope.hideLayer = function(layerName) {
          $scope.mapObj.removeLayer($scope.layers[layerName].obj);
          $scope.layers[layerName].visible = false;
      };

      $scope.toggleLayer = function(layerName) {
        if($scope.mapObj.hasLayer($scope.layers[layerName].obj) === false) {
          $scope.showLayer(layerName);
        } else {
          $scope.hideLayer(layerName);
        }
      };

      $scope.showSecondLayer = function(layerName) {
          $scope.layers[layerName].obj.addTo($scope.secondMapObj);
          $scope.layers[layerName].secondvisible = true;
      };

      $scope.hideSecondLayer = function(layerName) {
          $scope.secondMapObj.removeLayer($scope.layers[layerName].obj);
          $scope.layers[layerName].secondvisible = false;
      };

      $scope.toggleSecondLayer = function(layerName) {
        if($scope.secondMapObj.hasLayer($scope.layers[layerName].obj) === false) {
          $scope.showSecondLayer(layerName);
        } else {
          $scope.hideSecondLayer(layerName);
        }
      };

      $scope.$on('show-layers', function(event, showLayers) {
        angular.forEach($scope.layers, function(value, layerName) {
          if(showLayers.indexOf(layerName) !== -1) {
            $scope.$apply(function() {
              $scope.showLayer(layerName);
            });
          } else {
            $scope.$apply(function() {
              $scope.hideLayer(layerName);
            });
          }
        });
      });

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
