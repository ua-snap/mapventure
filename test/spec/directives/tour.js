/* globals: Tour */
'use strict';

describe('Directive: tour', function () {

  // load the directive's module
  beforeEach(module('mapventureApp'));

  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should instantiate a tour object', inject(function () {
    var tour = new Tour({
      steps: [
        {
          element: ".class",
          title: "Map",
          content: "Content",
          onShow: function() {
            scope.$broadcast('show-layers', [ 'layer_name' ]);
          }
        }
      ]
    });
    expect(tour).toBeDefined();
  }));
});
