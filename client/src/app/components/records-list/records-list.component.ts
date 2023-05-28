import { Component } from '@angular/core';
import { RecordService, Record } from 'src/app/services/record/record.service';
import { WcaLinkService } from 'src/app/services/wca-link/wca-link.service';

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.less']
})
export class RecordsListComponent {

  error: string = "";
  records: Record[] = [];

  constructor(private recordService: RecordService) { }

  ngOnInit(): void {
    this.recordService.getRecords().subscribe({
      next: (records) => {
        records.sort((a, b) => a.eventRank - b.eventRank);
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

  isNew(date: Date) {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    return date > lastMonth;
  }
}
