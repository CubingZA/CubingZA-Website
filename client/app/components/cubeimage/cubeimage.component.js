'use strict';
const angular = require('angular');

export class cubeimageComponent {
  /*@ngInject*/
  $onInit() {
    
  }
}

export default angular.module('cubingzaApp.cubeimage', [])
  .component('cubeimage', {
    template: require('./cubeimage.html'),
    bindings: { message: '<' },
    controller: cubeimageComponent
  })
  .name;
