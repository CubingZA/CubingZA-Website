'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('verify', {
      url: '/verify/:id/:code',
      template: '<verify></verify>'
    });
}
