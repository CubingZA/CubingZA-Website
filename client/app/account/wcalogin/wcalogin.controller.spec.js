'use strict';

describe('Component: WcaLoginController', function() {
  // load the controller's module
  beforeEach(module('cubingzaApp.signup.wca'));

  var WcaLoginController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    WcaLoginController = $componentController('wcalogin', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
