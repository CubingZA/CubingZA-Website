'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import Modal from '../components/modal/modal.service';

import AboutComponent from './about/about.component';
import ContactComponent from './contact/contact.component';
import NotificationsComponent from './notifications/notifications.component';
import PrivacyComponent from './privacy/privacy.component';
import EventsComponent from './events/events.component';

import NotificationService from './notificationsService/notificationsService.service';

import recordList from './components/recordList/recordList.component';
import competitionList from './components/competitionList/competitionList.component';
import cubeimage from './components/cubeimage/cubeimage.component';
import provincesMap from './components/provincesMap/provincesMap.component';
import LogoComponent from './components/logo/logo.component';

import './app.scss';

angular.module('cubingzaApp', [ngCookies, ngResource, ngSanitize, 'btford.socket-io', uiRouter,
  uiBootstrap, _Auth, account, admin, navbar, footer, main, constants, socket, util, Modal,
  cubeimage, AboutComponent, ContactComponent, competitionList, recordList, 
  NotificationsComponent, provincesMap, PrivacyComponent, EventsComponent, LogoComponent
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['cubingzaApp'], {
      strictDi: true
    });
  });
