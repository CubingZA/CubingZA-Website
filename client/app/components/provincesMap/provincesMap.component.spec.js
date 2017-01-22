'use strict';

describe('Component: provincesMap', function() {
  // load the component's module
  beforeEach(module('cubingzaApp.provincesMap'));

  var provincesMapComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    provincesMapComponent = $componentController('provincesMap', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
