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

  it('should do something', function () {
    init();

    expect(!!Map).toBe(true);
  });

  it('should be configurable', function () {
    module(function (MapProvider) {
      MapProvider.setSalutation('Lorem ipsum');
    });

    init();

    expect(Map.greet()).toEqual('Lorem ipsum');
  });

});
