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

    $scope.defaultLayers = ['active_fires'];
    $scope.crs = new L.Proj.CRS('EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
        {
          resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16],

          // Origin should be lower-left coordinate
          // in projected space.  Use GeoServer to
          // find this:
          // TileSet > Gridset Bounds > compute from maximum extent of SRS
          origin: [-4648005.934316417, 444809.882955059],
        }
    );

    // General options for Leaflet configuration.
    $scope.mapOptions = {
      zoom: 0,
      minZoom: 0,
      maxZoom: 5,
      center: [65, -158.5],
      maxBounds: new L.latLngBounds(
        L.latLng(70, 220),
        L.latLng(55, 180)
      )
    };

    // Base layer configuration.
    var baseConfiguration = {
      layers: 'alaska_osm',
      srs: 'EPSG:3338',
      transparent: true,
      format: 'image/png',
      version: '1.3',
      continuousWorld: true, // needed for non-3857 projs
      zIndex: null
    };

    // Place names layer configuration for Alaska
    var placeConfiguration = {
      layers: ['alaska_places_osm_3338'],
      transparent: true,
      srs: 'EPSG:3338',
      format: 'image/png',
      version: '1.3',
      continuousWorld: true, // needed for non-3857 projs
      zIndex: 100
    };

    var FireIcon = L.Icon.extend({
      options: {
        iconUrl: 'images/fire.svg',
        iconSize:     [25, 36],
        shadowSize:   [0, 0], // no shadow!
        iconAnchor:   [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
      }
    });

    var activeFireIcon = new FireIcon();
    var inactiveFireIcon = new FireIcon({
      iconUrl: 'images/inactive-fire.svg'
    });

    // Return a new instance of a base layer.
    $scope.getBaseLayer = function() {
      return new L.tileLayer.wms(Map.geoserverWmsUrl(), baseConfiguration);
    };

    // Return a new instance of a placename layer.
    $scope.getPlaceLayer = function() {
      return new L.tileLayer.wms(Map.geoserverWmsUrl(), placeConfiguration);
    };

    // This function loads the additional fire polygons
    $scope.onLoad = function(mapObj, secondMapObj) {

      // Query features for the entire scope of AK (3338 coords)
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

      $scope.fireMarkerCluster = L.markerClusterGroup();
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
            // Active fire polygons are red-ish,
            // inactive are grey.
            style: function(feature) {
              if (feature.properties.ACTIVENOW == 1) {
                return {
                  color: '#ff0000',
                  fillColor: '#E83C18',
                  opacity: 1,
                  weight: 2,
                  fillOpacity: 1
                };
              } else {
                return {
                  color: '#888888',
                  fillColor: '#888888',
                  opacity: 1,
                  weight: 3,
                  fillOpacity: 1
                };
              }
            },
            coordsToLatLng: coordsToLatLng,
            onEachFeature: function(feature, layer) {
              this.layer = layer;
              this.feature = feature;

              // Assign active/inactive fire icon.
              var icon = feature.properties.ACTIVENOW == 1 ?
                activeFireIcon : inactiveFireIcon;

              var popupOptions = {
                maxWidth: 200,
              };

              var popupContents = _.template('\
<h1><%= title %></h1>\
<h2><%= acres %></h2>\
<h3>Cause: <%= cause %></h3>\
<p class="updated" data-toggle="tooltip" data-placement="bottom" title="Perimeter and status of this fire was last updated on <%= updated %>">Updated <%= updated %></p>\
              ')(
                {
                  title: feature.properties.NAME,
                  acres: Math.ceil(feature.properties.ACRES) + ' acres',
                  cause: feature.properties.GENERALCAU || 'Unknown',
                  updated: moment.utc(
                      moment.unix(
                        feature.properties.UPDATETIME / 1000
                      )
                    ).format('MMMM Do, h:mm a')
                }
              );

              L.marker(
                coordsToLatLng(getCentroid2(feature.geometry.coordinates[0][0])),
                {
                  riseOnHover: true,
                  icon: icon
                })
              .on('popupopen', function() {
                $('p.updated').tooltip();
              })
              .bindPopup(popupContents, popupOptions)
              .addTo($scope.fireMarkerCluster);
            }
          }).addTo($scope.mapObj);
          $scope.mapObj.addLayer($scope.fireMarkerCluster);
        }
      });
    };

    $scope.layerOptions = function() {};

  }
]);

/* Helper function to place markers at the centroid
of their polygon.

http://stackoverflow.com/questions/22796520/finding-the-center-of-leaflet-polygon

*/
var getCentroid2 = function(arr) {
  var twoTimesSignedArea = 0;
  var cxTimes6SignedArea = 0;
  var cyTimes6SignedArea = 0;

  var length = arr.length;

  var x = function(i) { return arr[i % length][0]; };
  var y = function(i) { return arr[i % length][1]; };

  for (var i = 0; i < arr.length; i++) {
    var twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
    twoTimesSignedArea += twoSA;
    cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
    cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
  }
  var sixSignedArea = 3 * twoTimesSignedArea;
  return [cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];
};
