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
  '$rootScope',
  '$controller',
  '$http',
  '$routeParams',
  '$timeout',
  'ngDialog',
  'Map',
  'MapRegistry',
  'deviceDetector',
  function($scope, $rootScope, $controller, $http, $routeParams, $timeout, ngDialog, Map, MapRegistry, deviceDetector) {

    var GEOSERVER_WMS_URL = Map.geoserverWmsUrl();
    var GEONODE_API_URL = Map.geonodeApiUrl();

    /*
    These options must be defined by
    the Map Instance Controller (i.e. the
    specific Map controller instantiated
    for this specific map ID), but are
    listed here for reference.
    */
    $scope.defaultLayers = undefined;
    $scope.mapOptions = undefined;
    $scope.crs = undefined;
    $scope.getBaseLayer = undefined;
    /*
    End options to be overridden in MapInstance
    controllers.
    */

    // Detect device running application
    $scope.device = deviceDetector;

    // Will contain L.Layer.wms objects, keyed by layer name
    $scope.layers = {};

    // Toggle for layer menu to be minimized
    $scope.minimized = false;

    // Minimize the menu by default in mobile
    if ($scope.device.isMobile()) {
      $scope.minimized = true;
    }

    // Dual maps boolean
    $scope.dualMaps = false;

    // Sync maps boolean
    $scope.syncMaps = false;

    // The Proceed button on the splash screen
    // should be dimmed until Map is loaded.
    $scope.showMapButtonDisabled = true;

    // Clean up when we leave a specific map.
    $rootScope.$on('$locationChangeStart', function() {
      if ($scope.tour) {
        $scope.tour.end();
        $scope.tour = undefined;
      }
      Map.setReady(false);

      // Ensure per-map CSS is removed
      angular.element('body').removeClass('_' + $scope.map.uuid);
    });

    // Maps can override the Abstract overview of the map for
    // the splash screen, here.
    $scope.getAbstract = function() {
      return null;
    };

    Map.layers($routeParams.mapId).success(function(data) {
      $scope.map = data;

      // Create controller for map-specific functionality
      // Just invoking it will compile/execute it.
      var mapInstanceController = $controller(// jshint ignore:line
        MapRegistry.getControllerName($scope.map.uuid),
        {$scope: $scope}
      );

      if ($scope.getAbstract()) {
        $scope.abstract = $scope.getAbstract();
      } else {
        $http.get(GEONODE_API_URL + '/maps/' + $scope.map.id).success(function(data) {
          var converter = new showdown.Converter({
            openLinksInNewWindow: true
          });
          $scope.abstract = converter.makeHtml(data.abstract);
        });
      }

      // Attach UUID of map ID for custom CSS hooks
      // for this map.
      // TODO?: isolate this entire thing in a
      // directive of its own?
      angular.element('body').addClass('_' + $scope.map.uuid);

      // Set title of window to this map's title
      angular.element('title').text($scope.map.title);

      // Reversing the layers makes the order
      // match what we see in GeoNode's map editor.
      $scope.map.layers.reverse();

      // These need to be separate instances because we listen for events differently on each.
      var baseLayer = $scope.getBaseLayer();
      var secondBaseLayer = $scope.getBaseLayer();
      var placeLayer = $scope.getPlaceLayer();
      var secondPlaceLayer = $scope.getPlaceLayer();

      // MapOptions resolved by individual map configuration
      $scope.mapDefaults = angular.extend({
          crs: $scope.crs,
          zoomControl: false,
          scrollWheelZoom: true
        }, $scope.mapOptions
      );

      $scope.setDefaultView = function() {
      $scope.mapObj.setView(
        $scope.mapDefaults.center,
        $scope.mapDefaults.zoom,
        {
          reset: true
        }
      );
    };

      // Don't add the place layer if not defined
      var layers = placeLayer ? [baseLayer, placeLayer] : [baseLayer];
      var secondLayers = secondPlaceLayer ? [secondBaseLayer, secondPlaceLayer] : [secondBaseLayer];

      var firstMapOptions = angular.extend({
        layers: layers
      },
      $scope.mapDefaults);
      $scope.mapObj = L.map('snapmapapp', firstMapOptions);
      var secondMapOptions = angular.extend({
        layers: secondLayers
      },
      $scope.mapDefaults);
      $scope.secondMapObj = L.map('secondmap', secondMapOptions);

      // Correct default location of default Leaflet markers.
      L.Icon.Default.imagePath = Map.leafletImagePath();

      // Attach event handlers per-map.
      // The onLoad() function is defined in the
      // instance map and attached to this common
      // scope.
      $scope.onLoad($scope.mapObj, $scope.secondMapObj, $scope);

      // Attach local layers, if any
      $scope.addLocalLayers();

      // This checks for the 'load' event from Leaflet which means that the basemap
      // has completely loaded.
      baseLayer.on('load', function() {
      $scope.showMapButtonDisabled = false;
      $scope.$apply();
    });

      $scope.addLayers();

      // Show default layers
      angular.forEach($scope.defaultLayers, function(layerName) {
        $scope.showLayer(layerName);
      });

      $scope.mapObj.addControl($scope.sidebar);

      $scope.sortableOptions = {
        stop: function() {
          for (var i = 0; i < $scope.map.layers.length; i++) {
            $scope.layers[$scope.map.layers[i].name].obj.setZIndex($scope.map.layers.length - i);
            $scope.layers[$scope.map.layers[i].name].secondObj.setZIndex($scope.map.layers.length - i);
          }
        }
      };

      $scope.recenterMap = function(btn, map) {
        map.setView($scope.mapDefaults.center,$scope.mapDefaults.zoom);
      };

      new L.Control.Zoom({position: 'topright'}).addTo($scope.mapObj);
      new L.Control.Zoom({position: 'topright'}).addTo($scope.secondMapObj);
      new L.easyButton({
        id: 'home-button-map-left',
        position: 'topright',
        states: [{
          stateName: 'go-to-center',
          onClick: function(btn, map) {
            map.setView($scope.mapDefaults.center, $scope.mapDefaults.zoom);
          },
          title: 'Re-center Map',
          icon: 'glyphicon-home'
        }]
      }).addTo($scope.mapObj);

      new L.easyButton({
        id: 'home-button-map-right',
        position: 'topright',
        states: [{
          stateName: 'go-to-center',
          onClick: function(btn, map) {
            map.setView($scope.mapDefaults.center, $scope.mapDefaults.zoom);
          },
          title: 'Re-center Map',
          icon: 'glyphicon-home'
        }]
      }).addTo($scope.secondMapObj);

    });

    $scope.sidebar = L.control.sidebar('info-sidebar', {
      position: 'left',
      autoPan: false
    });

    $scope.activateAllLayers = function() {
      _.each($scope.layers, function(layerObj, layerName) {
        $scope.showLayer(layerName);
      });
    };

    // Maps can implement local layers, which are handled/drawn specially.
    $scope.addLocalLayers = function() {
      return;
    };

    $scope.addLayers = function() {

      var wmsLayerOptions = angular.extend({
        continuousWorld: true,
        transparent: true,
        tiled: 'true',
        format: 'image/png',
        version: '1.3',
        visible: false
      }, $scope.layerOptions());

      angular.forEach($scope.map.layers, function(layer) {
        layer.name = layer.name.replace('geonode:','');
        $scope.layers[layer.name] = {};

        if (true !== layer.local) {
          angular.extend(wmsLayerOptions, {
            layers: 'geonode:' + layer.name,
            name: layer.name
          });

          $scope.layers[layer.name].obj = L.tileLayer.wms(GEOSERVER_WMS_URL, wmsLayerOptions);
          $scope.layers[layer.name].secondObj = L.tileLayer.wms(GEOSERVER_WMS_URL, wmsLayerOptions);
        } else {
          // Flag this as nonlocal layer so other code can handle it
          $scope.layers[layer.name].local = true;
          $scope.layers[layer.name].obj = layer.getObject();
          $scope.layers[layer.name].secondObj = layer.getObject();
        }
      });
      Map.setReady(true);
    };

    $scope.showMapDefinedLayer = function(layerName) {
      // Will be defined in map controller if used at all
    };

    $scope.showSecondMapDefinedLayer = function(layerName) {
      // Will be defined in map controller if used at all
    };

    $scope.hideMapDefinedLayer = function(layerName) {
      // Will be defined in map controller if used at all
    };

    $scope.hideSecondMapDefinedLayer = function(layerName) {
      // Will be defined in map controller if used at all
    };

    $scope.showLayer = function(layerName) {
      $scope.layers[layerName].visible = true;
      $scope.showMapDefinedLayer(layerName);
      if (true !== $scope.layers[layerName].local) {
        $scope.layers[layerName].obj.addTo($scope.mapObj);
      }
    };

    $scope.hideLayer = function(layerName) {
      $scope.hideMapDefinedLayer(layerName);
      if (true !== $scope.layers[layerName].local) {
        $scope.mapObj.removeLayer($scope.layers[layerName].obj);
      }
      $scope.layers[layerName].visible = false;
    };

    $scope.toggleLayer = function(layerName) {
      if ($scope.layers[layerName].visible !== true) {
        $scope.showLayer(layerName);
      } else {
        $scope.hideLayer(layerName);
      }
    };

    $scope.showSecondLayer = function(layerName) {
      $scope.layers[layerName].secondvisible = true;
      $scope.showSecondMapDefinedLayer(layerName);
      if (true !== $scope.layers[layerName].local) {
        $scope.layers[layerName].secondObj.addTo($scope.secondMapObj);
      }
    };

    $scope.hideSecondLayer = function(layerName) {
      $scope.hideSecondMapDefinedLayer(layerName);
      if (true !== $scope.layers[layerName].local) {
        $scope.secondMapObj.removeLayer($scope.layers[layerName].secondObj);
      }
      $scope.layers[layerName].secondvisible = false;
    };

    $scope.toggleSecondLayer = function(layerName) {
        if ($scope.layers[layerName].secondvisible !== true) {
          $scope.showSecondLayer(layerName);
        } else {
          $scope.hideSecondLayer(layerName);
        }
      };

    $scope.$on('show-layers', function(event, showLayers) {
      angular.forEach($scope.layers, function(value, layerName) {
        if (showLayers.indexOf(layerName) !== -1) {
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

    $scope.$on('show-second-layers', function(event, showLayers) {
      angular.forEach($scope.layers, function(value, layerName) {
        if (showLayers.indexOf(layerName) !== -1) {
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

    $scope.$on('start-tour-dual-maps', function() {
      $scope.$evalAsync(function() {
        if ($scope.dualMaps === true) {
          $scope.showDualMaps();
        }
      });
    });

    $scope.$on('show-dual-maps', function() {
      $scope.$evalAsync(function() {
        $scope.showDualMaps();
      });
    });

    $scope.$on('hide-dual-maps', function() {
      $scope.$evalAsync(function() {
        $scope.hideDualMaps();
      });
    });

    $scope.$on('show-sync-maps', function() {
      $scope.$evalAsync(function() {
        $scope.synchronizeMaps();
      });
    });

    $scope.$on('hide-sync-maps', function() {
      $scope.$evalAsync(function() {
        $scope.unsynchronizeMaps();
      });
    });

    $scope.$on('show-graph', function() {
      $scope.$evalAsync(function() {
        $scope.showGraph();
      });
    });

    $scope.$on('hide-graph', function() {
      $scope.$evalAsync(function() {
        $scope.hideGraph();
      });
    });

    $scope.showMapInformation = function(mapId) {
      $http.get(GEONODE_API_URL + '/maps/' + mapId).success(function(data) {
        var converter = new showdown.Converter({
          openLinksInNewWindow: true
        });
        var content = '<p><a href="' + data.urlsuffix + '">' + data.urlsuffix + '</a></p>';
        content = content.concat(converter.makeHtml(data.abstract));
        $scope.sidebar.setContent(content).show();
      });
    };

    $scope.showDualMaps = function() {
      $scope.dualMaps = true;
      $timeout(function() {
        $scope.mapObj.invalidateSize();
        $scope.mapObj.panTo([65, -150]);
        $scope.secondMapObj.panTo([65, -150]);
      }, 250);
    };

    $scope.hideDualMaps = function() {
      $scope.dualMaps = false;
      if ($scope.syncMaps === true) {
        $scope.synchronizeMaps();
      }
      $timeout(function() {
        $scope.mapObj.invalidateSize();
        $scope.mapObj.panTo([65, -150]);
      }, 250);
    };

    $scope.toggleDualMaps = function() {
      if ($scope.dualMaps === false) {
        $scope.showDualMaps();
      } else {
        $scope.hideDualMaps();
      }
    };

    $scope.synchronizeMaps = function() {
      $scope.syncMaps = true;
      $scope.mapObj.sync($scope.secondMapObj);
      $scope.secondMapObj.sync($scope.mapObj);
    };

    $scope.unsynchronizeMaps = function() {
      $scope.syncMaps = false;
      $scope.mapObj.unsync($scope.secondMapObj);
      $scope.secondMapObj.unsync($scope.mapObj);
    };

    $scope.toggleSynchronizeMaps = function() {
      if ($scope.syncMaps === false) {
        $scope.synchronizeMaps();
      } else {
        $scope.unsynchronizeMaps();
      }
    };

    $scope.showLayerInformation = function(layerName) {
      var layer = _.find($scope.map.layers, function(layer) {
        return layer.name === layerName;
      });

      var converter = new showdown.Converter({
        openLinksInNewWindow: true
      });

      var content = '<h3>' + layer.capability.title + '</h3>';
      if (false !== layer.capability.legend) {
        content = content.concat(
          '<img id= "legend" src="' +
          GEOSERVER_WMS_URL +
          '?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' +
          layerName +
          '" onerror="this.style.display=\'none\'" />'
        );
      }
      content = content.concat(converter.makeHtml(layer.capability.abstract));
      $scope.sidebar.setContent(content).show();
    };

    $scope.startTour = function(tourStep) {
      if (null === tourStep || undefined === tourStep) {
        $scope.$emit('start-tour');
      }
    };

    $scope.endTour = function() {
      $scope.$emit('end-tour');
    };

  }
]);
