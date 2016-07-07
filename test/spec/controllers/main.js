'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('mapventureApp'));

  var $httpBackend, mapRequestHandler, createController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    mapRequestHandler = $httpBackend.when('GET', '/maps')
      .respond({ map1: 'map1'}, { map2: 'map2'}, {map3: 'map3'});

    scope = $rootScope.$new();
    createController = function() {
      return $controller('MainCtrl', {
        $scope: scope
      });
    };
  }));

  it('throws an exception if it cannot retrieve the list of maps', function () {
    // With no surrounding intercept for mocking the HTTP call,
    // we should get an error here.
  });
});
