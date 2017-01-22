'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('notifications', {
      url: '/notifications',
      template: '<notifications></notifications>',
      authenticate: true
    });
}
