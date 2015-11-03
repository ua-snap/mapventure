'use strict';

describe('Service: Map', function () {

  // instantiate service
  var Map,
    init = function () {
      inject(function (_Map_) {
        Map = _Map_;
      });
    };

  // load the service's module
  beforeEach(module('mapventureApp'));

  it('should provide a default URL for local dev', function() {
    module(function (MapProvider) {
      expect(MapProvider.getGeonodeApiUrl()).toEqual('http://localhost:8000/api');
    });
  });

  it('should allow you to configure the URL', function () {
    module(function (MapProvider) {
      MapProvider.setGeonodeApiUrl('http://mapventure.com:8080');
      expect(Map.getGeonodeApiUrl()).toEqual('http://mapventure.com:8080');
    });
  });

});
