'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './about.routes';

export class AboutComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('cubingzaApp.about', [uiRouter])
  .config(routes)
  .component('about', {
    template: require('./about.html'),
    controller: AboutComponent,
    controllerAs: 'aboutCtrl'
  })
  .name;
