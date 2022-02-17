import { StoredEventData } from '../../../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../../storage-vendors/ticket-storage-vendor';
import ExecutorTemplate from '../executor-template/executor-template';
import { EventResultSet } from './event-result-set';
import { HallResultSet } from './hall-result-set';
import { TicketResultSet } from './ticket-result-set';

export type QueryExecutors = {
  eventRelatedQueryExecutor : ExecutorTemplate<
  Partial<StoredEventData>,
  EventResultSet,
  StoredEventData[]
  >,
  ticketRelatedQueryExecutor : ExecutorTemplate<
  Partial<StoredTicketData>,
  TicketResultSet,
  StoredTicketData[]
  >,
  hallRelatedQueryExecutor : ExecutorTemplate<
  Partial<StoredHallData>,
  HallResultSet,
  StoredHallData[]
  >,
};
