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
  'Fire',
  '$http',
  '$q',
  function($scope, Map, Fire, $http, $q) {

    $scope.defaultLayers = ['fires_2017'];
    $scope.crs = new L.Proj.CRS('EPSG:3338',
      '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
        {
          resolutions: [2048, 1024, 512, 256, 128, 64],

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

    $scope.getAbstract = function() {
      return '<h1>Wildfire is a big deal in Alaska. With this map you can see current locations and sizes of wildfires and explore them in the context of long-term fire history, land cover types, and other data layers.</h1>' +
       '<div class="abstractWrapper">' +
       '<p>This is not an operational management tool. For the most current fire management information, we direct you to the following websites:</p>' +
       '<ul>' +
       '<li><a href="https://fire.ak.blm.gov" target="_blank">Alaska Interagency Coordination Center (AICC)</a></li>' +
       '<li><a href="http://fire.ak.blm.gov/content/aicc/sitreport/current.pdf" target="_blank">Current AICC Situation Report</a></li>' +
       '<li><a href="https://akfireinfo.com/" target="_blank">Alaska Wildland Fire Information</a></li>' +
       '</ul>' +
       '<p>Full credit goes to the Alaska Fire Service, State of Alaska, and the Alaska Interagency Coordination Center for all their hard work fighting fires and maintaining the data!</p>' +
       '</div>' +
       '';
    };
    var FireIcon = L.Icon.extend({
      options: {
        iconUrl: 'images/active_fire.png',
        iconSize:     [30, 35],
        shadowSize:   [0, 0], // no shadow!
        iconAnchor:   [16, 34], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
      }
    });

    var activeFireIcon = new FireIcon();
    var inactiveFireIcon = new FireIcon({
      iconUrl: 'images/inactive_fire.png'
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
    };

    $scope.firePolygons = null;
    $scope.fireMarkers = null;
    $scope.secondFirePolygons = null;
    $scope.secondFireMarkers = null;

    // This will be the container for the fire markers & popups.
    $scope.fireLayerGroup = L.layerGroup();
    $scope.secondFireLayerGroup = L.layerGroup();

    $scope.fetchFireData = function() {
      return $q(function(resolve, reject) {

        if ($scope.firePolygons == null) {
          // Query features for the entire scope of AK (3338 coords)
          Fire.getFeatures()
            .then(function success(res) {
              if (res) {
                $scope.firePolygons = getGeoJsonLayer(res.data);
                $scope.fireMarkers = getFireMarkers(res.data);
                $scope.secondFirePolygons = getGeoJsonLayer(res.data);
                $scope.secondFireMarkers = getFireMarkers(res.data);

                // Add layers to the LayerGroup we're using here.
                $scope.fireLayerGroup
                  .addLayer($scope.firePolygons)
                  .addLayer($scope.fireMarkers);
                $scope.secondFireLayerGroup
                  .addLayer($scope.secondFirePolygons)
                  .addLayer($scope.secondFireMarkers);

                resolve();
              }
            },
            function error() {
              // TODO: handle this error with a popup warning
              $scope.fireInfoPopup = false;
              reject();
            });
        } else {
          resolve();
        }
      });
    };

    $scope.getFireLayerGroup = function() {
      return $scope.fireLayerGroup;
    };

    // For any polygon features, return a marker with a bound popup.
    var getFireMarkers = function(geoJson) {
      var fireMarkers = [];
      var popupOptions = {
        maxWidth: 200,
      };
      _.each(geoJson.features, function(feature) {
        if (feature.geometry.type == 'Polygon') {

          // Reverse order from what we need
          var coords = getCentroid2(feature.geometry.coordinates[0]);
          var icon = isFireActive(feature.properties) ?
                activeFireIcon : inactiveFireIcon;

          fireMarkers.push(
            L.marker(new L.latLng([coords[1], coords[0]]),{icon: icon}).bindPopup(getFireMarkerPopupContents(
              {
                title: feature.properties.NAME,
                acres: feature.properties.acres,
                cause: feature.properties.GENERALCAUSE,
                updated: feature.properties.updated,
                outdate: feature.properties.OUTDATE
              }, popupOptions))
          );
        }
      });
      return L.layerGroup(fireMarkers);
    };

    // Builds and returns a complete GeoJSON layer for display on the map
    var getGeoJsonLayer = function(geoJson) {

      return L.geoJson(geoJson, {
        style: styleFirePolygons,
        pointToLayer: firePointFeatureHandler
      });
    };

    // Returns the style object for use in painting polygon outlines,
    // red if active, grey if out.
    // Used in getGeoJsonLayer function.
    var styleFirePolygons = function(feature) {
      if (isFireActive(feature.properties)) {
        return {
          color: '#ff0000',
          fillColor: '#E83C18',
          opacity: .8,
          weight: 2,
          fillOpacity: .3
        };
      } else {
        return {
          color: '#888888',
          fillColor: '#888888',
          opacity: .8,
          weight: 3,
          fillOpacity: 1
        };
      }
    };

    var geojsonMarkerOptions = {
      radius: 3,
      weight: 1,
      opacity: .7,
      fillOpacity: 0.2
    };

    // This handler is only used for point features (no polygon).
    // It returns a Leaflet divIcon marker with classes
    // for active/inactive, and if the size of the fire is
    // less than an acre, the class 'small' is attached.
    var firePointFeatureHandler = function(geoJson, latLng) {
      var isActive;
      var zIndex;
      var popupOptions = {
        maxWidth: 200,
      };
      if (isFireActive(geoJson.properties)) {
        isActive = 'active';
        zIndex = 1000;
      } else {
        isActive = 'inactive';
        zIndex = 300;
      }
      var acres = parseFloat(geoJson.properties.acres).toFixed(1);
      if (acres <= 1) {
        isActive += ' small';
        acres = ' ';
      }
      var icon = L.divIcon({
        className: isActive,
        html: '<span class="' + isActive + '">' + acres + '</span'
      });
      return L.marker(latLng, {
        icon: icon,
        zIndexOffset: zIndex
      }).bindPopup(getFireMarkerPopupContents(
        {
          title: geoJson.properties.NAME,
          acres: geoJson.properties.acres,
          cause: geoJson.properties.GENERALCAUSE,
          updated: geoJson.properties.updated,
          outdate: geoJson.properties.OUTDATE
        }, popupOptions));
    };

    // fireInfo must contain properties title, acres, cause, updated, outdate
    var getFireMarkerPopupContents = function(fireInfo) {

      var acres = fireInfo.acres + ' acres';
      var updated = _.isEmpty(fireInfo.updated) ? '' :
        '<p class="updated">Updated ' + fireInfo.updated + '</p>';
      var out = _.isEmpty(fireInfo.outdate) ? '' : '<p class="out">Out date: ' + moment.utc(moment.unix(fireInfo.outdate / 1000)).format('MMMM Do, h:mm a') + '</p>';
      var cause = _.isEmpty(fireInfo.cause) ? '' : '<h3>Cause: ' + fireInfo.cause + '</h3>';

      return _.template('\
<h1><%= title %></h1>\
<h2><%= acres %></h2>\
<%= cause %>\
<%= out %>\
<%= updated %>')(
        {
          title: fireInfo.title,
          acres: acres,
          cause: cause,
          updated: updated,
          out: out
        }
      );
    };

    // There's a few places in the code that are making this check,
    // and we've needed to swap it more than once to account
    // for differing upstream data.  This function implements
    // the logic to determine if a fire is active or not.
    var isFireActive = function(fireFeatures) {
      return fireFeatures.active;
    };

    $scope.layerOptions = function() {};

    $scope.addLocalLayers = function() {
      $scope.map.layers.unshift({
        'name': 'fires_2017',
        'title': 'All fires, 2017',
        'getObject': $scope.getFireLayerGroup,
        'local': true,
        'capability': {
          'title': 'All fires, 2017',
          'legend': false,
          'abstract': 'This layer shows all fires from 2017.  Small fires (1 acre or less) are shown as dots.  Larger fires with no mapped perimeter show the number of acres of the fire.  Larger fires with mapped perimeters have a marker that can be clicked on for more information.\n\nActive fires are shown in red, and inactive fires are shown in grey.'
        }
      });
    };

    $scope.showMapDefinedLayer = function(layerName) {

      if (layerName == 'fires_2017') {
        $scope.fetchFireData().then(function() {
          $scope.mapObj.addLayer($scope.fireLayerGroup);
        });
        return false;
      }
    };

    $scope.hideMapDefinedLayer = function(layerName) {
      if (layerName == 'fires_2017') {
        $scope.mapObj.removeLayer($scope.fireLayerGroup);
      }
    };

    $scope.showSecondMapDefinedLayer = function(layerName) {
      if (layerName == 'fires_2017') {
        $scope.fetchFireData().then(function() {
          $scope.secondMapObj.addLayer($scope.secondFireLayerGroup);
        });
      }
    };

    $scope.hideSecondMapDefinedLayer = function(layerName) {
      if (layerName == 'fires_2017') {
        $scope.secondMapObj.removeLayer($scope.secondFireLayerGroup);
      }
    };

    // Acres-burned time series graph configuration
    $scope.graphButtonText = 'Graph large fire seasons';
    $scope.graphLayout = $scope.graphLayout || {};
    $scope.graphDescription = 'This graph compares this year to all of the years when more than 1 million acres burned since records began in 2004. Source data is from the <a target="_blank" href="https://fire.ak.blm.gov/">Alaska Interagency Coordination Center (AICC)</a>.';

    $.extend($scope.graphLayout, {
      title: 'Cumulative Acres Burned',
      titlefont: {
        size: 20
      },
      font: {
        family: 'Lato'
      },
      margin: {
        l: 120,
        r: 120
      },
      xaxis: {
        type: 'category',
        ticks: 'array',
        tickvals: [
          'May 1',
          'June 1',
          'July 1',
          'August 1',
          'September 1'
        ],
        ticktext: [
          'May',
          'June',
          'July',
          'August',
          'September'
        ]
      },
      yaxis: {
        title: 'Cumulative Acres Burned',
        titlefont: {
          size: 18
        }
      }
    });

    // Acres-burned time series graph population
    $scope.graphData = [];
    Fire.getTimeSeries().then(function(timeSeries) {
      for (var year in timeSeries) {
        if (timeSeries.hasOwnProperty(year)) {
          var yearData = {
            name: year,
            x: timeSeries[year].dates,
            y: timeSeries[year].acres
          };

          if (year === moment().format('YYYY')) {
            yearData.mode = 'lines+markers';
          } else {
            yearData.mode = 'lines';
          }

          $scope.graphData.push(yearData);
        }
      }
    });
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
