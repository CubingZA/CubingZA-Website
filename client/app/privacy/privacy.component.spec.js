'use strict';

describe('Component: PrivacyComponent', function() {
  // load the controller's module
  beforeEach(module('projectApp.privacy'));

  var PrivacyComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PrivacyComponent = $componentController('privacy', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
