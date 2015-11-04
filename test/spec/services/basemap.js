'use strict';

describe('Service: BaseMap', function () {

  // load the service's module
  beforeEach(module('mapventureApp'));

  // instantiate service
  var BaseMap;
  beforeEach(inject(function (_BaseMap_) {
    BaseMap = _BaseMap_;
  }));

  it('should do something', function () {
    expect(!!BaseMap).toBe(true);
  });

});
