'use strict';

describe('Service: mapInitializer', function () {

  // load the service's module
  beforeEach(module('2015blueironhackWeiqingApp'));

  // instantiate service
  var mapInitializer;
  beforeEach(inject(function (_mapInitializer_) {
    mapInitializer = _mapInitializer_;
  }));

  it('should do something', function () {
    expect(!!mapInitializer).toBe(true);
  });

});
