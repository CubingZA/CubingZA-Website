'use strict';

import angular from 'angular';
import routes from './admin.routes';
import AdminController from './admin.controller';

export default angular.module('cubingzaApp.admin', ['cubingzaApp.auth', 'ui.router', 'cubingzaApp.Modal'])
  .config(routes)
  .controller('AdminController', AdminController)
  .name;
