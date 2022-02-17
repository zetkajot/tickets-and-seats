/* eslint-disable class-methods-use-this */
import { createPool, Pool, PoolConfig } from 'mariadb';
import StorageError from '../../errors/storage-error';
import CombinedStorageVendor from '../../storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../storage-vendors/ticket-storage-vendor';
import DeleteQueryBuilder from './query-creator/concrete-builders/delete-query-builder';
import InsertQueryBuilder from './query-creator/concrete-builders/insert-query-builder';
import SelectQueryBuilder from './query-creator/concrete-builders/select-query-builder';
import QueryCreationDirector from './query-creator/query-creation-director';
import { QueryFactories } from './types/query-factories';
import { ResultSetConverters } from './types/result-set-converters';
import utilityQueries from './utils/utility-queries';

export default class MariaDBStorageVendor implements CombinedStorageVendor {
  protected internalConnectionPool: Pool;

  private selectQueryCreator: QueryCreationDirector;

  private deleteQueryCreator: QueryCreationDirector;

  private insertQueryCreator: QueryCreationDirector;

  public get connectionPool() {
    return this.internalConnectionPool;
  }

  constructor(
    config: PoolConfig,
    private queries: QueryFactories,
    private converters: ResultSetConverters,
  ) {
    this.internalConnectionPool = createPool(config);
    this.selectQueryCreator = new QueryCreationDirector(new SelectQueryBuilder());
    this.deleteQueryCreator = new QueryCreationDirector(new DeleteQueryBuilder());
    this.insertQueryCreator = new QueryCreationDirector(new InsertQueryBuilder());
  }

  public async start(
    afterStart: (pool: Pool) => Promise<void> = utilityQueries.InitializeTables,
  ): Promise<void> {
    await this.internalConnectionPool.query('SELECT 1');
    if (afterStart) {
      await afterStart(this.internalConnectionPool);
    }
  }

  public async stop(beforeStop?: (pool: Pool) => Promise<void>): Promise<void> {
    if (beforeStop) {
      await beforeStop(this.internalConnectionPool);
    }
    await this.internalConnectionPool.end();
  }

  async saveEvent(data: StoredEventData): Promise<void> {
    const safeEventData = {
      ...data,
      startsAt: data.startsAt.getTime(),
      endsAt: data.endsAt.getTime(),
      reservedSeats: JSON.stringify(data.reservedSeats),
    };
    const { query, values } = this.insertQueryCreator.createQuery('event', safeEventData);
    const queryResult = await this.internalConnectionPool.query(query, values);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async findEvent(data: Partial<Pick<StoredEventData, 'id' | 'name' | 'hallId'>>): Promise<StoredEventData[]> {
    const safeData = data;
    Object.entries(safeData)
      .filter(([, value]) => value === undefined)
      .forEach(([name]) => delete safeData[name as keyof typeof safeData]);
    const { query, values } = this.selectQueryCreator.createQuery('event', safeData);
    const resultSet = await this.internalConnectionPool.query(query, values);
    const eventDataSet = this.converters.toEventDataSet(resultSet);
    return eventDataSet;
  }

  async deleteEvent(eventId: string): Promise<void> {
    const { query, values } = this.deleteQueryCreator.createQuery('event', { id: eventId });
    const queryResult = await this.internalConnectionPool.query(query, values);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async saveHall(data: StoredHallData): Promise<void> {
    const safeHallData = {
      ...data,
      layout: JSON.stringify(data.layout),
    };
    const { query, values } = this.insertQueryCreator.createQuery('hall', safeHallData);
    const queryResult = await this.internalConnectionPool.query(query, values);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async deleteHall(hallId: string): Promise<void> {
    const { query, values } = this.deleteQueryCreator.createQuery('hall', { id: hallId });
    const queryResult = await this.internalConnectionPool.query(query, values);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async saveTicket(data: StoredTicketData): Promise<void> {
    const { query, values } = this.insertQueryCreator.createQuery('ticket', data);
    const queryResult = await this.internalConnectionPool.query(query, values);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async findTicket(data: Partial<StoredTicketData>): Promise<StoredTicketData[]> {
    const { query, values } = this.selectQueryCreator.createQuery('ticket', data);
    const resultSet = await this.internalConnectionPool.query(query, values);
    const ticketDataSet = this.converters.toTicketDataSet(resultSet);
    return ticketDataSet;
  }

  async deleteTicket(ticketId: string): Promise<void> {
    const { query, values } = this.deleteQueryCreator.createQuery('ticket', { id: ticketId });
    const queryResult = await this.internalConnectionPool.query(query, values);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async findHall(data: Partial<Omit<StoredHallData, 'layout'>>): Promise<StoredHallData[]> {
    const safeData = data;
    Object.entries(safeData)
      .filter(([, value]) => value === undefined)
      .forEach(([name]) => delete safeData[name as keyof typeof safeData]);
    const { query, values } = this.selectQueryCreator.createQuery('hall', data);
    const resultSet = await this.internalConnectionPool.query(query, values);
    const hallDataSet = this.converters.toHallDataSet(resultSet);
    return hallDataSet;
  }
}
