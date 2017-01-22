'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './events.routes';

export class EventsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('projectApp.events', [uiRouter])
  .config(routes)
  .component('events', {
    template: require('./events.html'),
    controller: EventsComponent,
    controllerAs: 'eventsCtrl'
  })
  .name;
