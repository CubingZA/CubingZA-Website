'use strict';

describe('Component: VerifyComponent', function() {
  // load the controller's module
  beforeEach(module('projectApp.verify'));

  var VerifyComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    VerifyComponent = $componentController('verify', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
