'use strict';
const angular = require('angular');

export class competitionListComponent {
  /*@ngInject*/
  constructor($resource) {
    'ngInject';
    this.$resource = $resource;
        
    this.Comp = this.$resource('/api/events/upcoming');
    
//    this.comps = [];
    this.comps = this.Comp.query({}, () => {
      // Sort competitions by start date
      this.comps.sort(function(a, b) {
        if (a.startDate < b.startDate) {
          return -1;
        }
        else {
          return 1;
        }
      });
      
      // Show competitions by default
      for (let i = 0; i < this.comps.length; i++) {
        this.comps[i].showDetails = true;
      }
    });
  }
  
  testSendNotification() {
    this.$resource('/api/events/:id/notify').save({id: this.comps[0]._id}, {})
    .$promise
      .then(() => console.log('success'))
      .catch(() => console.log('failure'));
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
