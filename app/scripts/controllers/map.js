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
  'ngDialog',
  'Map',
  'BaseMap',
  'Slug',
  function ($scope, $http, $routeParams, $timeout, ngDialog, Map, BaseMap, Slug) {
      var geoserverUrl = Map.geoserverUrl();
      var geoserverWmsUrl = Map.geoserverWmsUrl();
      var geonodeUrl = Map.geonodeUrl();
      var geonodeApiUrl = Map.geonodeApiUrl();
      $scope.layers = {};
      $scope.progress = 0;
      $scope.processID = 0;

      Map.layers($routeParams.mapId).success(function(data) {
        $scope.map = data;

        $http.get(geonodeApiUrl + '/maps/' + $scope.map.id).success(function(data) {
          var converter = new showdown.Converter();
          var content = converter.makeHtml(data.abstract);
          angular.element('#splashOverviewContent').html(content);
        });

        // Attach class name for custom CSS hooks
        // for this map.  Class name is a slugified
        // version of the map's title.
        //
        // TODO: isolate this entire thing in a
        // directive of its own?
        angular.element('body').addClass(Slug.slugify($scope.map.title))

        // Reversing the layers makes the order
        // match what we see in GeoNode's map editor.
        $scope.map.layers.reverse();

        // These need to be separate instances because we listen for events differently on each.
        var crs = BaseMap.getCRS($scope.map.srid);
        var baseLayer = BaseMap.getBaseLayer($scope.map.srid, geoserverWmsUrl, crs.options.resolutions.length);
        var secondBaseLayer = BaseMap.getBaseLayer($scope.map.srid, geoserverWmsUrl, crs.options.resolutions.length);

        $scope.minimized = false;

        // This variable must be watched to allow for the sidebar
        // of Leaflet to hide and show the layer menu
        $scope.$watch('minimized');

        // This variable must be set to be watched or else the
        // Leaflet event does not update the ngHide function properly.
        $scope.$watch('showMapButtonDisabled');

        // Dual maps boolean
        $scope.dualMaps = false;

        // Sync maps boolean
        $scope.syncMaps = false;

        // The Proceed button on the splash screen
        // should be dimmed until Map is loaded.
        $scope.showMapButtonDisabled = true;

        // This checks for the 'load' event from Leaflet which means that the basemap
        // has completely loaded.
        baseLayer.on("load", function() {
          $scope.showMapButtonDisabled = false;
          $scope.$apply();
        });

        $scope.addLayers();

        var mapDefaults = angular.extend({
            center: [65, -150],
            zoom: 1,
            crs: crs,
            scrollWheelZoom: false,
            zoomControl: false
          }, BaseMap.getMapOptions($scope.map.id)
        );

        var firstMapOptions = angular.extend({
            layers: [
              baseLayer
            ]
          },
          mapDefaults);
        $scope.mapObj = L.map('snapmapapp', firstMapOptions);

        var secondMapOptions = angular.extend({
            layers: [
              secondBaseLayer
            ]
          },
          mapDefaults);
        $scope.secondMapObj = L.map('secondmap', secondMapOptions);

        // Show default layers
        angular.forEach(BaseMap.getDefaultLayers($scope.map.id), function(layerName){
          $scope.showLayer(layerName)
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
              $scope.layers[$scope.map.layers[i].name].secondObj.setZIndex($scope.map.layers.length - i);
            }
          }
        };

      new L.Control.Zoom({ position: 'topright' }).addTo($scope.mapObj);
      new L.Control.Zoom({ position: 'topright' }).addTo($scope.secondMapObj);

      });

      $scope.showSecondLayer = function(layerName) {
          $scope.layers[layerName].secondObj.addTo($scope.secondMapObj);
          $scope.layers[layerName].secondvisible = true;
      };

      $scope.hideSecondLayer = function(layerName) {
          $scope.secondMapObj.removeLayer($scope.layers[layerName].secondObj);
          $scope.layers[layerName].secondvisible = false;
      };

      $scope.toggleSecondLayer = function(layerName) {
        if($scope.secondMapObj.hasLayer($scope.layers[layerName].secondObj) === false) {
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
        $scope.layers[layer.name].obj = L.tileLayer.wms(geoserverWmsUrl, {
          continuousWorld: true,
          layers: layer.name,
          name: layer.name,
          transparent: true,
          format: 'image/png',
          version: '1.3',
          visible: false
        });
        $scope.layers[layer.name].secondObj = L.tileLayer.wms(geoserverWmsUrl, {
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

    $scope.downloadMap = function(mapId) {
      if ($scope.processID === 0) {
        $http.get(geonodeUrl + "/maps/" + mapId + "/immeddownload").then(function(response) {
          $scope.processID = response.data.id;
          $scope.checkDownload($scope.processID);
        });
      } else {
        $scope.checkDownload($scope.processID);
      }
    };

    $scope.checkDownload = function(processID) {
      ngDialog.open({
        template: 'mapDownload',
        scope: $scope
      });

      if ($scope.progress <= 0) {
        $scope.progress = 0;
        var checkStatus = setInterval(function (){
          $.ajax({
            type: "GET",
            url : geoserverUrl + "/rest/process/batchDownload/status/" + processID
          })
          .done(function(result){
            $scope.progress = result.process.progress.toFixed(2);
            if (result.process.status === "FINISHED") {
              window.open(geoserverUrl + "/rest/process/batchDownload/download/" +  processID, "_blank");
              $scope.progress = -1;
              $scope.processID = 0;
              clearInterval(checkStatus);
            } else if (result.process.status === "ERROR") {
              $scope.progress = -2;
              $scope.processID = 0;
              clearInterval(checkStatus);
            }
            $scope.$apply();
          });
        }, 1000);
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


    $scope.$on('start-tour-dual-maps', function(event) {
      $scope.$evalAsync(function() {
        if ($scope.dualMaps === true) {
          $scope.showDualMaps();
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
      $http.get(geonodeApiUrl + '/maps/' + mapId).success(function(data) {
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
      content = content.concat('<img src="'+ geoserverWmsUrl + '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + layerName + '" alt="legend" />');
      content = content.concat(converter.makeHtml(layer.capability.abstract));
      $scope.sidebar.setContent(content).show();
    };

    $scope.startTour = function() {
      /* These map IDs will need to be changed based
         upon the map ID of the system running the GeoNode
         instance. */
      if ($routeParams.mapId == 2) {
        $scope.$emit('iem-start-tour');
      } else if ($routeParams.mapId == 8) {
        $scope.$emit('ncep-start-tour');
      }
    }
  }
]);
