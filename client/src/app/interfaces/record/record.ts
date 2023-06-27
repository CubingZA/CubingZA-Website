export interface Record {
  eventName: string;
  eventId: string;
  singleName: string;
  singleResult: string;
  singleId: string;
  singleDate?: Date;
  singleNR?: boolean;
  averageName: string;
  averageResult: string;
  averageId: string;
  averageDate?: Date;
  averageNR?: boolean;
  eventRank?: number;
  province?: string;
}
