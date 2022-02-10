import { StoredEventData } from '../../../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../../storage-vendors/ticket-storage-vendor';
import { EventResultSet } from './event-result-set';
import { HallResultSet } from './hall-result-set';
import { TicketResultSet } from './ticket-result-set';

export type ResultSetConverters = {
  toHallDataSet: (resultSet: HallResultSet) => StoredHallData[];
  toEventDataSet: (resultSet: EventResultSet) => StoredEventData[];
  toTicketDataSet: (resultSet: TicketResultSet) => StoredTicketData[]
};
