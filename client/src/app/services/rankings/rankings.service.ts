import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RankingsService {

  constructor(
    private http: HttpClient
  ) { }

  getSingleRankings(event: string, province: string, page?: number) {
    return this.http.get(`/api/rankings/${province}/${event}/single?page=${page}`)
  }

  getAverageRankings(event: string, province: string, page?: number) {
    return this.http.get(`/api/rankings/${province}/${event}/single?page=${page}`)
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