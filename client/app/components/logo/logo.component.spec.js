'use strict';

describe('Component: logo', function() {
  // load the component's module
  beforeEach(module('projectApp.logo'));

  var logoComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    logoComponent = $componentController('logo', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
