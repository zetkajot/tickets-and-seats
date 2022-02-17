import { StoredEventData } from '../../../../storage-vendors/event-storage-vendor';
import { EventResultSet } from '../../types/event-result-set';
import ExecutorTemplate from '../query-executor';

export type EventQueryExecutor = ExecutorTemplate<
Partial<StoredEventData>,
EventResultSet,
StoredEventData[]
>;
