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
        $scope.baselayer = BaseMap.getBaseLayer($scope.map.srid, geoserverUrl, $scope.crs.options.resolutions.length);
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
              $scope.layers[$scope.map.layers[i].name].obj.setZIndex($scope.map.layers.length - i);
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

      $scope.showMapInformation = function(mapId) {
        $http.get('http://localhost:8000/api/maps/' + mapId).success(function(data) {
          var converter = new showdown.Converter();
          var content = '<h3>' + data.title + '</h3>';
          content = content.concat('<p><a href="' + data.urlsuffix + '">' + data.urlsuffix + '</a></p>');
          content = content.concat(converter.makeHtml(data.abstract));
          $scope.sidebar.setContent(content).show();
        });
      };

      $scope.showLayerInformation = function(layerName) {
        var layer = _.find($scope.map.layers, function(layer) {
          return layer.name === layerName;
        });
        var converter = new showdown.Converter();
        var content = '<h3>' + layer.capability.title + '</h3>';
        content = content.concat('<img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + layerName + '" alt="legend" />');
        content = content.concat(converter.makeHtml(layer.capability.abstract));
        $scope.sidebar.setContent(content).show();
      };
    });
  }
]);
