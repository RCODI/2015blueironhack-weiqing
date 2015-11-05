'use strict';

describe('Controller: MashupCtrl', function () {

  // load the controller's module
  beforeEach(module('2015blueironhackWeiqingApp'));

  var MashupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MashupCtrl = $controller('MashupCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MashupCtrl.awesomeThings.length).toBe(3);
  });
});
