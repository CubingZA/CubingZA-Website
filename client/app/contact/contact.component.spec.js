'use strict';

describe('Component: ContactComponent', function() {
  // load the controller's module
  beforeEach(module('cubingzaApp.contact'));

  var ContactComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ContactComponent = $componentController('contact', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
