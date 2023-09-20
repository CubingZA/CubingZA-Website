import { Component } from '@angular/core';
import { AlertsService } from 'src/app/components/alerts/alerts.service';
import { EventsService } from 'src/app/services/events/events.service';
import { ProvinceService } from 'src/app/services/province/province.service';
import { RecordService } from 'src/app/services/record/record.service';
import { WcaLinkService } from 'src/app/services/wca-link/wca-link.service';
import { ProvincialRecordTable } from 'src/app/interfaces/record/provincial-record-table';
import { Record } from 'src/app/interfaces/record/record';

@Component({
  selector: 'app-records',
  templateUrl: './provincial-records.component.html',
  styleUrls: ['./provincial-records.component.less']
})
export class ProvincialRecordsComponent {

  records?: ProvincialRecordTable;
  link: WcaLinkService;

  eventId: string = '';

  constructor(
    private recordService: RecordService,
    private eventsService: EventsService,
    private provinceService: ProvinceService,
    private alerts: AlertsService,
    private wcaLinkService: WcaLinkService
  ) {
    this.link = wcaLinkService;
  }

  ngOnInit(): void {
    this.alerts.clear();
    this.recordService.getProvincialRecords().subscribe({
      next: (records) => {
        this.records = records;
      },
      error: (err) => {
        console.error(err);
        this.alerts.addAlert('danger', 'Error while loading provincial records');
      }
    });
  }

  getEvents(): string[] {
    if (!this.records) return [];
    return this.eventsService.getEvents().map(event => event.id);
  }

  getEventName(eventId: string): string {
    return this.eventsService.getEventName(eventId);
  }

  showAvgForEvent(eventId: string): boolean {
    if (!this.records || !this.records[eventId]) return false;

    let records = this.records[eventId];
    for (let record of records) {
      if (record.averageResult) {
        return true;
      }
    }
    return false;

  }

  getProvinceName(provinceId?: string): string {
    if (!provinceId) return "";
    return this.provinceService.getProvinceName(provinceId);
  }

  getRecordsForEvent(eventId: string): Record[] {
    if (!this.records) return [];
    return this.records[eventId];
  }

  onEventChange(eventId: string): void {
    this.eventId = eventId;
  }

  isSelected(eventId: string): boolean {
    return this.eventId === '' ? true : this.eventId === eventId;
  }
}
