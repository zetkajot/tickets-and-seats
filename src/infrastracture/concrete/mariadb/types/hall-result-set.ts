import { ResultSet } from './result-set';

export type HallResult = {
  id: string,
  name: string,
  layout: string,
};

export type HallResultSet = ResultSet<HallResult>;
