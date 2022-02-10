import { ResultSet } from './result-set';

export type HallResult = {
  id: string,
  name: string,
  layout: [number, number, number][],
};

export type HallResultSet = ResultSet<HallResult>;
