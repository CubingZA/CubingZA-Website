'use strict';

describe('Directive: compileTemplate', function() {
  // load the directive's module
  beforeEach(module('projectApp.compileTemplate'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<compile-template></compile-template>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the compileTemplate directive');
  }));
});
