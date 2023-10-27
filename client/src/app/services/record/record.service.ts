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
          record.singleDate = record.singleDate ? record.singleDate.map(date => new Date(date)) : undefined;
          record.averageDate = record.averageDate ? record.averageDate.map(date => new Date(date)) : undefined;
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

        let firstSingle = ranking.single ? ranking.single[0] : undefined;
        let firstAverage = ranking.average ? ranking.average[0] : undefined;

        let record: Record = {
          eventName: this.eventsService.getEventName(eventId),
          eventId: eventId,

          singleResult: firstSingle?.best ? firstSingle.best : "",
          singleName: ranking.single ? ranking.single.map(item => item.personName) : [],
          singleId: ranking.single ? ranking.single.map(item => item.wcaID) : [],
          singleNR: firstSingle?.countryRank === 1,

          averageResult: firstAverage?.best ? firstAverage.best : "",
          averageName: ranking.average ? ranking.average.map(item => item.personName) : [],
          averageId: ranking.average ? ranking.average.map(item => item.wcaID) : [],
          averageNR: firstAverage?.countryRank === 1,

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
      single?: Ranking[];
      average?: Ranking[];
    }
  }
}

