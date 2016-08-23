'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:IamCtrl
 * @description
 * # IAM Ctrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('IamCtrl', [
    '$scope',
    'Map',
    '$http',
    function($scope, Map, $http) {

      // Default layers are switched to Visible after
      // the map has loaded.
      $scope.defaultLayers = [];

      // Called after the data has been loaded,
      // this function can be used to modify & hook into
      // map events.  $scope is inherited from the parent
      // scope (Controllers/Map).  mapObj and secondMapObj
      // are both instances of Leaflet maps.
      $scope.onLoad = function(mapObj, secondMapObj) {

        $('<a type="button" href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank" class="iam-info-button btn btn-primary"> <span class="glyphicon glyphicon-question-sign"></span> &nbsp; Dataset information&hellip; </a>')
          .prependTo('.mapTools');

        /* Add points of interest */
        _.each($scope.hotspots, function(e) {
          L.marker(e.latlng).bindPopup(
            '<h1>' + e.name + '</h1>' +
            e.description
          ).on('click', function zoomToMarker(e) {
            $scope.mapObj.setView([
              e.latlng.lat + .5,
              e.latlng.lng - 4
            ], 3);
            $scope.activateAllLayers();
          }).addTo(mapObj);
        });

        // Usually-invisible marker that will be
        // used as a target during the tour.
        $scope.tourMarker = L.circleMarker(
          [
            66.43771036250584,
            -162.61488740208168
          ],
          {
            className: 'tourMarker',
            stroke: false,
            fillColor: '#DAEE88',
            fillOpacity: 1
          }).addTo(mapObj);

        // Query features for the entire scope of AK (3338 coords)
        var requestUrl = Map.geoserverUrl() + '/wfs?service=wfs&version=2.0.0&request=GetFeature&typeName=geonode:iam_area_alaska_albers&srsName=EPSG:3572&outputFormat=application/json';
        $http.get(requestUrl).then(function success(res) {
            var coordsToLatLng = function(coords) {
              var xy = {
                x: coords[0],
                y: coords[1]
              };
              var p = $scope.mapObj.options.crs.projection.unproject(xy);
              return p;
            };
            // This will added/removed during the tour.
            $scope.iamPoly = L.geoJson(res.data, {
              coordsToLatLng: coordsToLatLng
            });
          },
          function error() {
            console.info(res);
          });

      };

      // We need to modify the default pan-Arctic
      // projection to avoid a bug.
      var proj = new L.Proj.CRS('EPSG:3572',
        '+proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
        {
          resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
          origin: [-4234288.146966308, -4234288.146966307]
        }
      );

      // trust me.
      // Without this (= pi/2), proj4js returns an undefined
      // value for tiles requested at the North Pole and
      // it causes a runtime exception.
      proj.projection._proj.oProj.phi0 = 1.5708;
      $scope.crs = proj;

      // General options for Leaflet configuration.
      $scope.mapOptions = {
        zoom: 1,
        minZoom: 0,
        maxZoom: 5,
        center: [64, -165]
      };

      // Base layer configuration for pan-Arctic map.
      var baseConfiguration = {
        layers: ['geonode:ne_10m_coastline', 'geonode:iam_area_alaska_albers'],
        transparent: true,
        format: 'image/png',
        version: '1.3',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: null
      };

      // Return a new instance of a base layer.
      $scope.getBaseLayer = function() {
        return new L.tileLayer.wms(Map.geoserverWmsUrl(), baseConfiguration);
      };

      $scope.layerOptions = function() {
        return {
          opacity: 0.5
        };
      };

      // Object containing interesting points/hotspots information.
      $scope.hotspots = [
        {
          'name': 'St. Lawrence Island area',
          'latlng': [63.726247, -170.498930],
          'description': '\
<p><strong>In the St. Lawrence Island area, 17 environmental, 4 economic and 3 cultural datasets overlap.</strong></p>'
        },
        {
          'name': 'Point Hope area',
          'latlng': [68.299069, -166.739916],
          'description': '\
<p><strong>In the Point Hope area, 17 environmental, 5 economic and 4 cultural datasets overlap.</strong></p>'
        },
        {
          'name': 'Prudhoe Bay area',
          'latlng': [70.456491,  -148.755187],
          'description': '\
<p><strong>In the Prudhoe Bay area, 19 environmental, 8 economic and 5 cultural datasets overlap.</strong></p>'
        }
      ];
    }]);
