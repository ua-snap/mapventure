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
      var geoserverUrl = 'http://localhost:8080/geoserver/wms';
      $scope.layers = {};

      Map.layers($routeParams.mapId).success(function(data) {
        $scope.map = data;

        // Reversing the layers makes the order
        // match what we see in GeoNode's map editor.
        $scope.map.layers.reverse();

        $scope.crs = BaseMap.getCRS($scope.map.srid);
        $scope.baselayer = BaseMap.getBaseLayer($scope.map.srid, geoserverUrl,$scope.crs.options.resolutions.length);

        $scope.secondcrs = BaseMap.getCRS($scope.map.srid);
        $scope.secondbaselayer = BaseMap.getBaseLayer($scope.map.srid, geoserverUrl,$scope.secondcrs.options.resolutions.length);

        $scope.minimized = false;

        // This variable must be watched to allow for the sidebar
        // of Leaflet to hide and show the layer menu
        $scope.$watch('minimized');

        // This variable must be set to be watched or else the
        // Leaflet event does not update the ngHide function properly.
        $scope.$watch('splashHide');

        // Dual maps boolean
        $scope.dualMaps = false;

        // Sync maps boolean
        $scope.syncMaps = false;

        // The splash screen should be on until Map is loaded.
        $scope.splashHide = false;

        // This checks for the 'load' event from Leaflet which means that the basemap
        // has completely loaded.
        $scope.baselayer.on("load", function() {
          $scope.splashHide = true;
          $scope.$apply();
          $('#mapLoadingOverlayText').html('&hellip;Enjoy!');
        });

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

        $scope.sidebar.on('show', function() {
          $scope.minimize_menu();
        });

        $scope.sidebar.on('hide', function() {
          $scope.minimize_menu();
          $scope.$apply();
        });

        $scope.mapObj.addControl($scope.sidebar);

        $scope.sortableOptions = {
          stop: function() {
            for(var i = 0; i < $scope.map.layers.length; i++) {
              $scope.layers[$scope.map.layers[i].name].obj.setZIndex($scope.map.layers.length - i);
            }
          }
        };

      new L.Control.Zoom({ position: 'topright' }).addTo($scope.mapObj);

      });

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
          $scope.hideLayer(layerName);
          $scope.showSecondLayer(layerName);
        } else {
          $scope.hideSecondLayer(layerName);
        }
      };

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
        $scope.hideSecondLayer(layerName);
        $scope.showLayer(layerName);
      } else {
        $scope.hideLayer(layerName);
      }
    };

    $scope.$on('show-layers', function(event, showLayers) {
      angular.forEach($scope.layers, function(value, layerName) {
        if(showLayers.indexOf(layerName) !== -1) {
          $scope.$evalAsync(function() {
            $scope.showLayer(layerName);
          });
        } else {
          $scope.$evalAsync(function() {
            $scope.hideLayer(layerName);
          });
        }
      });
    });

    $scope.minimize_menu = function() {
      if ($scope.minimized == false) {
        $scope.minimized = true;
      } else {
        $scope.minimized = false;
      }
    };

    $scope.$on('show-second-layers', function(event, showLayers) {
      angular.forEach($scope.layers, function(value, layerName) {
        if(showLayers.indexOf(layerName) !== -1) {
          $scope.$evalAsync(function() {
            $scope.showSecondLayer(layerName);
          });
        } else {
          $scope.$evalAsync(function() {
            $scope.hideSecondLayer(layerName);
          });
        }
      });
    });


    $scope.$on('show-dual-maps', function(event) {
      $scope.$evalAsync(function() {
        $scope.showDualMaps();
      });
    });

    $scope.$on('show-sync-maps', function(event) {
      $scope.$evalAsync(function() {
        $scope.syncDualMaps();
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

    $scope.showDualMaps = function() {
      if ($scope.dualMaps === false) {
        $scope.dualMaps = true;
        $timeout(function() {
          $scope.mapObj.invalidateSize();
          $scope.mapObj.panTo([65, -150]);
          $scope.secondMapObj.panTo([65, -150]);
        }, 250);
      } else {
        $scope.dualMaps = false;
        if ($scope.syncMaps === true) $scope.syncDualMaps();
        $timeout(function() {
          $scope.mapObj.invalidateSize();
          $scope.mapObj.panTo([65, -150]);
        }, 250);
      }
    };

    $scope.syncDualMaps = function() {
      if ($scope.syncMaps === false) {
        $scope.syncMaps = true;
        $scope.mapObj.sync($scope.secondMapObj);
        $scope.secondMapObj.sync($scope.mapObj);
      } else {
        $scope.syncMaps = false;
        $scope.mapObj.unsync($scope.secondMapObj);
        $scope.secondMapObj.unsync($scope.mapObj);
      }
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

    $scope.startTour = function() {
      $scope.$emit('start-tour');
    }
  }
]);
