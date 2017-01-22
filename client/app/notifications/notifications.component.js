'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './notifications.routes';

export class NotificationsComponent {
  /*@ngInject*/
  constructor($resource) {
    'ngInject';
    
    this.locations = [
      'Gauteng',
      'North West',
      'Limpopo',
      'Mpumalanga',
      'Kwa-Zulu Natal',
      'Free State',
      'Northern Cape',
      'Western Cape',
      'Eastern Cape'
    ];
    
  }
}

export default angular.module('cubingzaApp.notifications', [uiRouter])
  .config(routes)
  .component('notifications', {
    template: require('./notifications.html'),
    controller: NotificationsComponent,
    controllerAs: 'notificationsCtrl'
  })
  .name;
