import { Component } from '@angular/core';

import { RecordService } from 'src/app/services/record/record.service';
import { WcaLinkService } from 'src/app/services/wca-link/wca-link.service';

import { Record } from 'src/app/interfaces/record/record';

@Component({
  selector: 'app-records-list',
  templateUrl: './national-records-list.component.html',
  styleUrls: ['./national-records-list.component.less']
})
export class NationalRecordsListComponent {

  error: string = "";
  records: Record[] = [];

  link: WcaLinkService;

  constructor(
    private recordService: RecordService,
    private _wcaLinkService: WcaLinkService
  ) {
    this.link = _wcaLinkService;
  }

  ngOnInit(): void {
    this.recordService.getNationalRecords().subscribe({
      next: (records) => {
        records.sort((a, b) => {
          return (a.eventRank ? a.eventRank : 0) - (b.eventRank ? b.eventRank : 0);
        });
        this.records = records;
      },
      error: (err) => {
        switch (err.status) {
          case 504:
            this.error = "Could not fetch records. The server is not responding.";
            break;
          default:
            this.error = "Could not fetch records. Please try again later.";
            break;
        }
      }
    });
  }

  isNew(dates?: Date[]) {
    if (!dates) return false;

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    for (let i in dates) {
      if (dates[i] > lastMonth) return true;
    }
    return false
  }
}
