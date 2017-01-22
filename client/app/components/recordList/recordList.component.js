'use strict';
const angular = require('angular');

export class recordListComponent {

  /*@ngInject*/
  constructor($resource) {
    'ngInject';

    this.Record = $resource('/api/records');

    this.records = this.Record.query({}, () => {
      this.records.sort((a, b) => {return a.eventRank-b.eventRank});
    });
  }
}

export default angular.module('cubingzaApp.recordList', [])
  .component('recordList', {
    template: require('./recordList.html'),
    bindings: { message: '<' },
    controller: recordListComponent,
    controllerAs: "recordsCtrl"
  })
  .name;
