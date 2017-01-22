'use strict';

describe('Component: competitionList', function() {
  // load the component's module
  beforeEach(module('cubingzaApp.competitionList'));

  var competitionListComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    competitionListComponent = $componentController('competitionList', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
