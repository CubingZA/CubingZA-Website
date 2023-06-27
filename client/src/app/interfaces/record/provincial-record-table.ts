import { Record } from './record';

export interface ProvincialRecordTable {
  [eventId: string]: Record[];
}
