export interface Record {
  eventName: string;
  eventId: string;
  eventRank?: number;

  province?: string;

  singleResult: string;
  singleName: string[];
  singleId: string[];
  singleDate?: Date[];
  singleNR?: boolean;

  averageResult: string;
  averageName: string[];
  averageId: string[];
  averageDate?: Date[];
  averageNR?: boolean;
}
