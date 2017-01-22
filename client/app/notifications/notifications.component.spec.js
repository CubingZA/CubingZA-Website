'use strict';

describe('Component: NotificationsComponent', function() {
  // load the controller's module
  beforeEach(module('cubingzaApp.notifications'));

  var NotificationsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    NotificationsComponent = $componentController('notifications', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
