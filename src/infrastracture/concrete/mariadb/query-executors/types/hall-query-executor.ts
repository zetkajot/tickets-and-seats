import { StoredHallData } from '../../../../storage-vendors/hall-storage-vendor';
import { HallResultSet } from '../../types/hall-result-set';
import ExecutorTemplate from '../query-executor';

export type HallQueryExecutor = ExecutorTemplate<
Partial<StoredHallData>,
HallResultSet,
StoredHallData[]
>;
