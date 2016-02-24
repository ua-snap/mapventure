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
      expect(MapProvider.getGeonodeUrl()).toEqual('http://localhost:8000');
    });
  });

  it('should allow you to configure the URL', function () {
    module(function (MapProvider) {
      MapProvider.setGeonodeUrl('http://mapventure.com:8080');
      expect(Map.getGeonodeUrl()).toEqual('http://mapventure.com:8080');
    });
  });

});
