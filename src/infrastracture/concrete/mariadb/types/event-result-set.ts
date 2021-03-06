import { ResultSet } from './result-set';

export type EventResult = {
  id: string,
  name: string,
  hallid: string,
  startsat: number,
  endsat: number,
  isopen: boolean;
  reservedseats: number[];
};

export type EventResultSet = ResultSet<EventResult>;
