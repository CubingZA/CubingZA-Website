'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('contact', {
      url: '/contact',
      template: '<contact></contact>'
    });
}
