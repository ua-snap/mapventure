'use strict';

describe('Directive: tour', function () {

  // load the directive's module
  beforeEach(module('mapventureApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tour></tour>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tour directive');
  }));
});
