'use strict';

describe('Component: EventsComponent', function() {
  // load the controller's module
  beforeEach(module('projectApp.events'));

  var EventsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    EventsComponent = $componentController('events', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
