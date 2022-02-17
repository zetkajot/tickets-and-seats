import { StoredTicketData } from '../../../../storage-vendors/ticket-storage-vendor';
import { TicketResultSet } from '../../types/ticket-result-set';
import ExecutorTemplate from '../query-executor';

export type TicketQueryExecutor = ExecutorTemplate<
Partial<StoredTicketData>,
TicketResultSet,
StoredTicketData[]
>;
