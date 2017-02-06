import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket, Auth, $resource) {
    'ngInject';
    this.$http = $http;
    this.$resource = $resource;
    this.socket = socket;

    this.isLoggedIn = Auth.isLoggedInSync;
  }
}

export default angular.module('cubingzaApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
