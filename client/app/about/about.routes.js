'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('about', {
      url: '/about',
      template: '<about></about>'
    });
}
