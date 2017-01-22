'use strict';
const angular = require('angular');

export class competitionListComponent {
  /*@ngInject*/
  constructor($resource) {
    'ngInject';
    
        
    this.Comp = $resource('/api/events/upcoming');
    
//    this.comps = [];
    this.comps = this.Comp.query({}, () => {})
    
  }
}

export default angular.module('cubingzaApp.competitionList', [])
  .component('competitionList', {
    template: require('./competitionList.html'),
    bindings: { listSizeLimit: '@' },
    controller: competitionListComponent,
    controllerAs: 'compCtrl'
  })
  .name;
