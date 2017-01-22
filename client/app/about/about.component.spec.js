'use strict';

describe('Component: AboutComponent', function() {
  // load the controller's module
  beforeEach(module('cubingzaApp.about'));

  var AboutComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AboutComponent = $componentController('about', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
