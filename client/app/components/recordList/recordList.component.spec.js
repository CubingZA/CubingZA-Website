'use strict';

describe('Component: recordList', function() {
  // load the component's module
  beforeEach(module('cubingzaApp.recordList'));

  var recordListComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    recordListComponent = $componentController('recordList', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
