import { ResultSet } from './result-set';

export type TicketResult = {
  id: string,
  eventid: string,
  seatno: number,
};

export type TicketResultSet = ResultSet<TicketResult>;
