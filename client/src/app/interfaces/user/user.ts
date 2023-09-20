import { ProvinceSelection } from './province-selection';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  provider: string[];
  notificationSettings: ProvinceSelection;
  eventLog?: any[];
  wcaID?: string;
  wcaCountryID?: string;
  homeProvince?: string;
}
