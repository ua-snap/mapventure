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

      $scope.getMapData = function() {
        return {
          'abstract': '## What areas of the Arctic are &ldquo;important&rdquo;?\r\n\r\nOne challenge that managers and policy makers often face is the conflict of interests among groups. This was evident when the [Scenarios Network for Alaska and Arctic Planning](https://www.snap.uaf.edu) was asked to identify specific geographic “areas of environmental, economic, and cultural importance” in Arctic Alaska for a 2013 report to the President of the United states on [Integrated Arctic Management (IAM)](https://www.afsc.noaa.gov/publications/misc_pdf/iamreport.pdf). While many groups have an answer to this question, the answer depends on the perspective and interests of the group.\r\n\r\nAs a proof of concept, SNAP took an objective approach to identifying important areas by displaying existing geospatial datasets that fit into the environmental, economic, and cultural categories to see where they overlap. Based upon available data, this can illustrate the relative importance of those areas, identify potential areas of conflict, and highlight gaps in Arctic geospatial data.\r\n',
          'id': 25,
          'title': 'Integrated Arctic Management',
          'uuid': '6dd7678c-5dc7-11e6-9ccd-00163edb1deb',
          'layers': [
            {
              'abstract': 'This layer shows cultural sites and buildings, as well as protected areas in the IAM area. Arctic Alaska has a long history of inhabitants, settlers, and traders since the earliest families crossed the Bering Land Bridge some 20,000 years ago. Cultural sites and structures are important artifacts. “Protected areas” are defined here as areas designated to preserve cultural and/or recreational features and activities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
              'name': 'geonode:cult_rec',
              'title': 'Cultural and protected areas'
            },
            {
              'abstract': 'This layer shows the communities and subsistence areas within the IAM area. People living in Arctic Alaska impact, and are being impacted by, the environmental, economic, and cultural features and changes in their area.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
              'name': 'geonode:comm_subs',
              'title': 'Communities and subsistence areas'
            },
            {
              'abstract': 'This layer displays oil and natural gas wells, offshore leasing areas, and portions of the TransAlaska pipeline located in the IAM area. The oil industry plays an important economic role in the Arctic and has both positive and negative environmental and cultural impacts.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
              'name': 'geonode:oil_infra',
              'title': 'Oil infrastructure'
            },
            {
              'abstract': 'The transportation layer shows locations of airports, marine ports, road system, shipping routes, and general transportation infrastructure in the IAM area. It highlights areas where there are multiple means of transportation for various cultural and economic reasons.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
              'name': 'geonode:trans',
              'title': 'Transportation'
            },
            {
              'abstract': 'This layer shows the distribution of five fish species and the combined distribution of marine, estuarine, anadromous, and freshwater fish species in the IAM area. All of the fish species are a significant food source in Arctic marine food webs and in the lives of people in coastal communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
              'name': 'geonode:fish',
              'title': 'Fish'
            },
            {
              'abstract': 'This layer shows locations of Important Bird Areas (IBAs) and murre colonies in the IAM area. IBAs are identified as vital habitats for birds and other wildlife using an internationally developed set of criteria. These areas are both critical to ecosystem biodiversity and sensitive to possible disturbances from increased use of Arctic areas. Murres, being one of the most numerous Arctic seabirds, play an important role in Arctic marine food webs and in the lives of people in nearby communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
              'name': 'geonode:birds',
              'title': 'Birds'
            },
            {
              'abstract': 'This layer shows the distribution of ten mammal species including whales, seals, walrus, polar bear, and caribou. These species represent some of the most abundant in the Arctic and the IAM area. Besides being an important part of the Arctic ecosystem, they all have significant economic and cultural value to Alaska Native communities.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
              'name': 'geonode:mammals',
              'title': 'Mammals'
            },
            {
              'abstract': 'This layer shows ecologically significant areas identified by two separate sources. These areas highlight the important habitats for sustaining a diversity of marine wildlife.\n\n<a href="https://docs.google.com/document/u/1/d/1MayMZ6fIfz40tBLhftiisQVpHoGPJuFKxEtkMMcLi88/pub" target="_blank">More info and data access</a>',
              'name': 'geonode:impareas',
              'title': 'Significant ecological areas'
            }
          ]
        };
      };

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
            e.description, {
              maxWidth: 600
            }
          ).on('click', function zoomToMarker(e) {
            $scope.mapObj.setView([
              e.latlng.lat,
              e.latlng.lng
            ]);
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
          resolutions: [4096, 2048, 1024, 512, 256, 128],
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
        zoom: 0,
        minZoom: 0,
        maxZoom: 5,
        center: [64, -165]
      };

      // Base layer configuration for pan-Arctic map.
      var baseConfiguration = {
        layers: ['arctic_osm_3572', 'geonode:iam_area_alaska_albers'],
        transparent: true,
        format: 'image/png',
        version: '1.3',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: null
      };

      // Place names layer configuration for pan-Arctic map.
      var placeConfiguration = {
        layers: ['arctic_places_osm_3572'],
        transparent: true,
        srs: 'EPSG:3572',
        format: 'image/png',
        version: '1.3',
        continuousWorld: true, // needed for non-3857 projs
        zIndex: 100
      };

      // Return a new instance of a base layer.
      $scope.getBaseLayer = function() {
        return new L.tileLayer.wms(Map.geoserverWmsUrl(), baseConfiguration);
      };

      // Return a new instance of a placename layer.
      $scope.getPlaceLayer = function() {
        return new L.tileLayer.wms(Map.geoserverWmsUrl(), placeConfiguration);
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
          'description': '<p>In the St. Lawrence Island area 17 environmental, 4 economic and 3 cultural datasets overlap.</p>'
        },
        {
          'name': 'Point Hope area',
          'latlng': [68.299069, -166.739916],
          'description': '\
<p>In the Point Hope area, 17 environmental, 5 economic and 4 cultural datasets overlap.</p>'
        },
        {
          'name': 'Prudhoe Bay area',
          'latlng': [70.456491,  -148.755187],
          'description': '\
<p>In the Prudhoe Bay area, 19 environmental, 8 economic and 5 cultural datasets overlap.</p>'
        }
      ];
    }]);
