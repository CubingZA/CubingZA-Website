'use strict';
const angular = require('angular');

export class cubeimageComponent {
  /*@ngInject*/
  constructor() {
    
  }

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
