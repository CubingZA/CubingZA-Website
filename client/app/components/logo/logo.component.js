'use strict';
const angular = require('angular');

export class logoComponent {
  /*@ngInject*/
  constructor() {
    
    let colours = ['#000','#2f2','#ff2','#24f','#d00','#eee'];
        
    this.blocks = [];
    for (let c = 0; c < colours.length; c++) {
      this.blocks.push({
        width: '40px', 
        height: '40px', 
        display: 'inline-block', 
        margin: '3px',
        'background-color': colours[c],
        'border-radius': '3px'
      });
    }
  }
}

export default angular.module('projectApp.logo', [])
  .component('logo', {
    template: '<div><div ng-repeat="block in $ctrl.blocks" ng-style="block"></div></div>',
    bindings: { message: '<' },
    controller: logoComponent
  })
  .name;
