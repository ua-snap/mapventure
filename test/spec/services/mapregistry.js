'use strict';

describe('Service: MapRegistry', function () {

  // load the service's module
  beforeEach(module('mapventureApp'));

  // instantiate service
  var MapRegistry;
  beforeEach(inject(function (_MapRegistry_) {
    MapRegistry = _MapRegistry_;
  }));

  it('should do something', function () {
    expect(!!MapRegistry).toBe(true);
  });

});
