'use strict';

describe('Directive: mapWidget', function () {

  // load the directive's module
  beforeEach(module('2015blueironhackWeiqingApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<map-widget></map-widget>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mapWidget directive');
  }));
});
