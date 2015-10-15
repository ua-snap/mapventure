'use strict';

describe('Directive: mapList', function () {

  // load the directive's module
  beforeEach(module('mapventureApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<map-list></map-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mapList directive');
  }));
});
