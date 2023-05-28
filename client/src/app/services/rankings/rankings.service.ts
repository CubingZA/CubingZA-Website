import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingsService {

  private cancelRanking: Subject<void> = new Subject<void>();
  private cancelCount: Subject<void> = new Subject<void>();

  constructor(
    private http: HttpClient
  ) { }

  getRankings(event: string, province: string, type: string, page?: number): Observable<Ranking[]> {
    let endPoint = `/api/rankings/${province}/${event}/${type}`
    if (page) {
      endPoint += `?page=${page}`;
    }
    return this.http.get<Ranking[]>(endPoint)
    .pipe(takeUntil(this.cancelRanking));
  }

  getRankingsCount(event: string, province: string, type: string): Observable<number> {
    return this.http.get<number>(`/api/rankings/${province}/${event}/${type}/count`)
    .pipe(takeUntil(this.cancelCount));
  }

  cancelPendingRankingRequests(): void {
    this.cancelRanking.next();
    this.cancelRanking.complete();
    this.cancelRanking = new Subject<void>();
  }

  cancelPendingCountRequests(): void {
    this.cancelCount.next();
    this.cancelCount.complete();
    this.cancelCount = new Subject<void>();
  }

}

export type Ranking = {
  _id: string,
  wcaID: string,
  eventId: string,
  countryRank: number,
  best: string,
  userId: string,
  personName: string,
  province: string,
  provinceRank: number
}