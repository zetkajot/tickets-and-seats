import { ResultSet } from './result-set';

type HallResult = {
  id: string,
  name: string,
  layout: string,
};

export type HallResultSet = ResultSet<HallResult>;
