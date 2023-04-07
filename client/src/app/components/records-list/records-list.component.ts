import { Component } from '@angular/core';
import { RecordService, Record } from 'src/app/services/record/record.service';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.less']
})
export class RecordsListComponent {

  records: Record[] = [];

  constructor(private recordService: RecordService) { 
    this.recordService.getRecords().subscribe((records) => {
      records.sort((a, b) => a.eventRank - b.eventRank);
      this.records = records;
    });
  }

  isNew(date: Date) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return date > lastMonth;
  }
}
