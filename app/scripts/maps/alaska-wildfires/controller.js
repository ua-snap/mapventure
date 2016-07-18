'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:AlaskaWildfiresCtrl
 * @description
 * # Alaska wildfires
 * This controller handles special functionality
 * for the Alaska Wildfire map.
 */

var app = angular.module('mapventureApp');

app.controller('AlaskaWildfiresCtrl', [
  '$scope',
  'Map',
  '$http',
  function($scope, Map, $http) {

    // Some configuration for this map object.
    // (In version history, this used to be
    // in a `basemap` Service).
    $scope.defaultLayers = ['active_fires'];
    $scope.crs = new L.Proj.CRS('EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
        {
          resolutions: [65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16],
          origin: [0, 0]
        }
    );

    // General options for Leaflet configuration.
    $scope.mapOptions = {
      zoom: 5,
      minZoom: 5,
      maxZoom: 11,
      maxBounds: new L.latLngBounds(
        L.latLng(70.5, -175),
        L.latLng(50, -135)
      )
    };

    // Base layer configuration.
    var baseConfiguration = {
      layers: 'MapProxy:osm',
      transparent: true,
      format: 'image/png',
      version: '1.3',
      continuousWorld: true, // needed for non-3857 projs
      noWrap: true, // may be needed for non-3857 projs
      zIndex: null
    };

    // Return a new instance of a base layer.
    $scope.getBaseLayer = function() {
      return new L.tileLayer.wms(Map.geoserverWmsUrl(), baseConfiguration);
    };

    // This function loads the additional fire polygons
    $scope.onLoad = function(mapObj, secondMapObj) {

      // Configure correct location for inbuilt / custom
      // map markers
      L.Icon.Default.imagePath = Map.leafletImagePath();

      var baseUrl = Map.geoserverUrl() + '/wfs?service=wfs&version=2.0.0&request=GetFeature&typeName=geonode:active_fires&srsName=EPSG:3338&outputFormat=application/json&bbox=';
      var requestUrl = baseUrl +
        '-2255938.4795,' +
        '449981.1884,' +
        '1646517.6368,' +
        '2676986.5642';
      $http.get(requestUrl).then(function success(res) {
        $scope.fireInfoPopup = res;
      },
      function error() {
        $scope.fireInfoPopup = false;
      });

      $scope.fireInfoPopup = false;
      $scope.$watch('fireInfoPopup', function(e) {
        if (e) {
          var coordsToLatLng = function(coords) {
            var xy = {
              x: coords[0],
              y: coords[1]
            };
            var p = $scope.mapObj.options.crs.projection.unproject(xy);
            return p;
          };

          L.geoJson(e.data, {
            style: function() {
              return {
                color: '#ff0000',
                fillColor: '#ff0000'
              };
            },
            coordsToLatLng: coordsToLatLng,
            onEachFeature: function(feature, layer) {
              this.layer = layer;
              this.feature = feature;

              var dateString = moment.unix(
                feature.properties.UPDATETIME / 1000 // microseconds
              ).format('MMMM Do, h:mm:ss a');

              var popupOptions = {
                maxWidth: 200,
              };
              var cause = 'Cause: ' + feature.properties.GENERALCAU;
              var popupContents = '<h1>' + feature.properties.NAME + '</h1>';
              popupContents += '<h2>' + feature.properties.ACRES + ' acres</h2>';
              if (cause) {
                popupContents += '<h3>' + cause + '</h3>';
              }
              popupContents += '<p class="updated">Last updated ' + dateString + '</p>';
              layer.bindPopup(popupContents, popupOptions);
              L.marker(
                coordsToLatLng(feature.geometry.coordinates[0][0][0]),
                {

                })
              .on('click',
                function zoomToFirePolygon() {
                  if (undefined === $scope.zoomLevel &&
                    undefined === $scope.mapCenter
                  ) {
                    $scope.minimizeMenu();
                    $scope.zoomLevel = $scope.mapObj.getZoom();
                    $scope.mapCenter = $scope.mapObj.getCenter();
                    $scope.mapObj.fitBounds(layer.getBounds());
                    $scope.$apply();
                  }
                }
              )
              .bindPopup(popupContents, popupOptions)
              .on('popupclose',
                function restoreZoomLevel() {
                  $scope.minimizeMenu();
                  $scope.mapObj.setZoom($scope.zoomLevel);
                  $scope.mapObj.panTo($scope.mapCenter);
                  $scope.zoomLevel = undefined;
                  $scope.mapCenter = undefined;
                  $scope.$apply();
                }
              )
              .addTo($scope.mapObj);
            }
          }).addTo($scope.mapObj);
        }
      });

    };

  }
]);
