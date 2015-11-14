'use strict';

describe('Service: dataConfig', function () {

  // load the service's module
  beforeEach(module('2015blueironhackWeiqingApp'));

  // instantiate service
  var dataConfig;
  beforeEach(inject(function (_dataConfig_) {
    dataConfig = _dataConfig_;
  }));

  it('should do something', function () {
    expect(!!dataConfig).toBe(true);
  });

});
