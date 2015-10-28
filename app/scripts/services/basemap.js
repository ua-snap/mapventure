'use strict';

/**
 * @ngdoc service
 * @name mapventureApp.BaseMap
 * @description
 * # BaseMap
 * Factory in the mapventureApp.
 */
angular.module('mapventureApp')
  .factory('BaseMap', function () {

    var service = {};

    /**
      Get CRS Function
      Purpose: Used to generate the desired coordinate reference system for a particular map
      Input: epsg_code - EPSG Code as integer value.
      Output: Returns a new Leaflet CRS object using the correct options for the input EPSG code
    */
    service.getCRS = function(epsg_code) {
      if (epsg_code === 'EPSG:3413') {
          return new L.Proj.CRS('EPSG:3413',
              '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
              {
                  resolutions: [8192,4096, 2048, 1024, 512, 256, 128],
                  origin: [0, 0]
              }
          );
      } else {
          return new L.Proj.CRS('EPSG:3338',
              '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs',
              {
                  resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
                  origin: [0, 0]
              }
          );
      } 
    };

    /**
      Get Base Layer Function
      Purpose: Generates the base layer from a WMS layer provided by the input to the function.
      Definition: Base layers are non-toggleable layers used to place other layers on top of.
      Input: epsg_code - EPSG Code as integer value.
             layerUrl - Full URL to web-accessible WMS service providing our imported baselayer.
             maximumZoom - The maximum number of resolutions available from the created CRS.
      Output: Returns a new Leaflet WMS layer object created from the layerURL input.
    */
    service.getBaseLayer = function(epsg_code, layerUrl, maximumZoom) {
        return new L.tileLayer.wms(layerUrl, {
              continuousWorld: true,
              maxZoom: maximumZoom, 
              minZoom: 0,
              layers: 'natural_earth_base',
              format: 'image/png',
              version: '1.3'
        });
    };

    return service;
  });
