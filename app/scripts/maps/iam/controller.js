'use strict';

/**
 * @ngdoc function
 * @name mapventureApp.controller:DefaultCtrl
 * @description
 * # DefaultCtrl
 * Controller of the mapventureApp
 */
angular.module('mapventureApp')
  .controller('IamCtrl', [
    '$scope',
    'Map',
    function($scope, Map) {

      // Default layers are switched to Visible after
      // the map has loaded.
      $scope.defaultLayers = [];

      // Called after the data has been loaded,
      // this function can be used to modify & hook into
      // map events.  $scope is inherited from the parent
      // scope (Controllers/Map).  mapObj and secondMapObj
      // are both instances of Leaflet maps.
      $scope.onLoad = function(mapObj, secondMapObj) {

        /* Add points of interest */
        _.each($scope.hotspots, function(e) {
          L.marker(e.latlng).bindPopup(
            '<h1>' + e.name + '</h1>' +
            e.description
          ).on('click', function zoomToMarker(e) {
            $scope.mapObj.setView(e.latlng, 4);
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

      // Object containing interesting points/hotspots information.
      $scope.hotspots = [
        {
          'name': 'St. Lawrence Island',
          'latlng': [63.333802, -170.039820],
          'description': '\
<ul>\
  <li>Nutrient-rich waters create a highly productive marine ecosystem and key habitat for many species.</li>\
  <li>1500 island inhabitants depend on subsistence harvest.</li>\
  <li>Risks for increased vessel traffic include: air and water pollution, underwater noise pollution, and interference with subsistence activities.</li>\
</ul>'
        },
        {
          'name': 'Point Hope',
          'latlng': [68.349432, -166.771550],
          'description': '\
<ul>\
  <li>Excellent access to marine mammals, ice conditions allow easy boat launchings into open leads early in the spring whaling season.</li>\
  <li>Increasingly vulnerable to ice jams and flooding due to storm intensity, ersoion and late sea ice freeze up.</li>\
  <li>Changes in climate are influencing food and water security. The mental health of Arctic people is also affected by life-altering changes in their environment and traditions.</li>\
</ul>'
        },
        {
          'name': 'Prudhoe Bay',
          'latlng': [70.248864, -148.287767],
          'description': '\
<ul>\
  <li>The timing, quantity, and quality of sea ice affect resource development, maritime traffic, wildlife health, food security, and coastal erosion.</li>\
  <li>The Prudhoe Bay Oilfield and TransAlaska Pipeline produce air pollution and oil spills.</li>\
  <li>Resource extraction required frozen conditions to transport heavy equipment and maintain infrastructure.</li>\
</ul>'
        }
      ];
    }]);
