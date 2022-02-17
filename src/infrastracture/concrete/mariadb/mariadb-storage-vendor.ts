import CombinedStorageVendor from '../../storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../storage-vendors/ticket-storage-vendor';
import MariaDBConnector from './mariadb-connector';
import QueryExecutorsFactory from './query-executors/query-executors-factory';
import { EventQueryExecutor } from './query-executors/types/event-query-executor';
import { HallQueryExecutor } from './query-executors/types/hall-query-executor';
import { TicketQueryExecutor } from './query-executors/types/ticket-query-executor';

export default class MariaDBStorageVendor implements CombinedStorageVendor {
  private eventQueryExecutor: EventQueryExecutor;

  private ticketQueryExecutor: TicketQueryExecutor;

  private hallQueryExecutor: HallQueryExecutor;

  constructor(
    connector: MariaDBConnector,
    executorsFactory: QueryExecutorsFactory,
  ) {
    this.eventQueryExecutor = executorsFactory.makeEventQueryExecutor(connector.connectionPool);
    this.hallQueryExecutor = executorsFactory.makeHallQueryExecutor(connector.connectionPool);
    this.ticketQueryExecutor = executorsFactory.makeTicketQueryExecutor(connector.connectionPool);
  }

  async saveEvent(data: StoredEventData): Promise<void> {
    await this.eventQueryExecutor.executeInsertQuery(data);
  }

  async findEvent(data: Partial<Pick<StoredEventData, 'id' | 'name' | 'hallId'>>): Promise<StoredEventData[]> {
    return this.eventQueryExecutor.executeSelectQuery(data);
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.eventQueryExecutor.executeDeleteQuery({ id: eventId });
  }

  async saveHall(data: StoredHallData): Promise<void> {
    await this.hallQueryExecutor.executeInsertQuery(data);
  }

  async deleteHall(hallId: string): Promise<void> {
    await this.hallQueryExecutor.executeDeleteQuery({ id: hallId });
  }

  async saveTicket(data: StoredTicketData): Promise<void> {
    await this.ticketQueryExecutor.executeInsertQuery(data);
  }

  async findTicket(data: Partial<StoredTicketData>): Promise<StoredTicketData[]> {
    return this.ticketQueryExecutor.executeSelectQuery(data);
  }

  async deleteTicket(ticketId: string): Promise<void> {
    await this.ticketQueryExecutor.executeDeleteQuery({ id: ticketId });
  }

  async findHall(data: Partial<Omit<StoredHallData, 'layout'>>): Promise<StoredHallData[]> {
    return this.hallQueryExecutor.executeSelectQuery(data);
  }
}
