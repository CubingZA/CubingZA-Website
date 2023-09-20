export interface Competition {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  address: string;
  city: string;
  province: string;
  registrationName: string;
  notificationsSent?: boolean;
  showDetails?: boolean;
}
