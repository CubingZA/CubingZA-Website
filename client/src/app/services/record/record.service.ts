import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { Ranking } from '../provincial-rankings/provincial-rankings.service';
import { EventsService } from '../events/events.service';

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
          averageName: ranking.average?.personName ? ranking.average.personName : "",
          averageResult: ranking.average?.best ? ranking.average.best : "",
          averageId: ranking.average?.wcaID ? ranking.average.wcaID : "",
          province: province
        };
        records[eventId].push(record);
      });
    });
    return records;
  }
}

export type Record = {
  eventName: string;
  eventId: string;
  singleName: string;
  singleResult: string;
  singleId: string;
  singleDate?: Date;
  averageName: string;
  averageResult: string;
  averageId: string;
  averageDate?: Date;
  eventRank?: number;
  province?: string;
};

export type ProvincialRecordTable = {
  [eventId: string]: Record[];
}

export type ProvincialRecordResponse = {
  [eventId: string]: {
    [province: string]: {
      single?: Ranking;
      average?: Ranking;
    }
  }
}

