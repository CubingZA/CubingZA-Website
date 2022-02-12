'use strict';
const angular = require('angular');
const moment = require('moment');

export class recordListComponent {

  /*@ngInject*/
  constructor($resource) {
    'ngInject';

    this.Record = $resource('/api/records');

    this.records = this.Record.query({}, () => {
      this.records.sort((a, b) => a.eventRank - b.eventRank);
    });
  }

  isNew(date) {
    var oneMonthAgo = moment().subtract(1, 'months');
    return moment(date).isAfter(oneMonthAgo);
  }
}

export default angular.module('cubingzaApp.recordList', [])
  .component('recordList', {
    template: require('./recordList.html'),
    bindings: { message: '<' },
    controller: recordListComponent,
    controllerAs: 'recordsCtrl'
  })
  .name;
