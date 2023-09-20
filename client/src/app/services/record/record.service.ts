import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { EventsService } from '../events/events.service';

import { Ranking } from 'src/app/interfaces/ranking/ranking';
import { Record } from 'src/app/interfaces/record/record';
import { ProvincialRecordTable } from 'src/app/interfaces/record/provincial-record-table';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private eventsService: EventsService,
    private http: HttpClient
  ) { }

  getNationalRecords() {
    return this.http.get<Record[]>('/api/records')
    .pipe(
      tap(records => {
        return records.map(record => {
          record.singleDate = record.singleDate ? new Date(record.singleDate) : undefined;
          record.averageDate = record.averageDate ? new Date(record.averageDate) : undefined;
          return record;
        });
      })
    );
  }

  getProvincialRecords(): Observable<ProvincialRecordTable> {
    return this.http.get<ProvincialRecordResponse>('/api/rankings/records')
    .pipe(
      map((rankings) => this.convertRecordResponseToRecordTable(rankings)),
    );
  }

  convertRecordResponseToRecordTable(response: ProvincialRecordResponse): ProvincialRecordTable {
    let records: ProvincialRecordTable = {};
    Object.keys(response).forEach((eventId) => {
      records[eventId] = [];
      Object.keys(response[eventId]).forEach((province) => {
        let ranking = response[eventId][province];
        let record: Record = {
          eventName: this.eventsService.getEventName(eventId),
          eventId: eventId,
          singleName: ranking.single?.personName ? ranking.single.personName : "",
          singleResult: ranking.single?.best ? ranking.single.best : "",
          singleId: ranking.single?.wcaID ? ranking.single.wcaID : "",
          singleNR: ranking.single?.countryRank === 1,
          averageName: ranking.average?.personName ? ranking.average.personName : "",
          averageResult: ranking.average?.best ? ranking.average.best : "",
          averageId: ranking.average?.wcaID ? ranking.average.wcaID : "",
          averageNR: ranking.average?.countryRank === 1,
          province: province
        };
        records[eventId].push(record);
      });
    });
    return records;
  }
}

export type ProvincialRecordResponse = {
  [eventId: string]: {
    [province: string]: {
      single?: Ranking;
      average?: Ranking;
    }
  }
}

