/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createPool, Pool, PoolConfig } from 'mariadb';
import StorageError from '../../errors/storage-error';
import CombinedStorageVendor from '../../storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../storage-vendors/hall-storage-vendor';
import { StoredTicketData } from '../../storage-vendors/ticket-storage-vendor';
import tableSchema from './table-schema';
import { QueryFactories } from './types/query-factories';
import { ResultSetConverters } from './types/result-set-converters';

export type MariaDBSVOptions = {
  skipTableInitialization?: boolean;
  removeDataOnStart?: boolean;
  removeDataOnShutdown?: boolean;
  dropTablesOnShutdown?: boolean;
};
export default class MariaDBStorageVendor implements CombinedStorageVendor {
  public static async init(
    config: PoolConfig,
    queries: QueryFactories,
    converters: ResultSetConverters,
    userOptions?: MariaDBSVOptions,
  ) {
    const options: MariaDBSVOptions = {
      dropTablesOnShutdown: false,
      removeDataOnShutdown: false,
      removeDataOnStart: false,
      skipTableInitialization: false,
      ...userOptions,
    };
    const pool = createPool(config);
    const sv = new MariaDBStorageVendor(pool, queries, converters, options);
    if (!options.skipTableInitialization) {
      await MariaDBStorageVendor.initializeTables(pool);
    }
    if (options.removeDataOnStart) {
      await MariaDBStorageVendor.clearTableData(pool);
    }
    return sv;
  }

  protected constructor(
    public readonly connectionPool: Pool,
    private queries: QueryFactories,
    private converters: ResultSetConverters,
    private options: MariaDBSVOptions,
  ) {
  }

  protected static async initializeTables(pool: Pool) {
    await pool.query(tableSchema.hall);
    await pool.query(tableSchema.event);
    await pool.query(tableSchema.ticket);
  }

  protected static async clearTableData(pool: Pool) {
    await pool.query('DELETE FROM ticket');
    await pool.query('DELETE FROM event');
    await pool.query('DELETE FROM hall');
  }

  protected static async dropTables(pool: Pool) {
    await pool.query('DROP TABLE IF EXISTS ticket, event, hall;');
  }

  public async shutdown() {
    if (this.options.removeDataOnShutdown) {
      await MariaDBStorageVendor.clearTableData(this.connectionPool);
    }
    if (this.options.dropTablesOnShutdown) {
      await MariaDBStorageVendor.dropTables(this.connectionPool);
    }
    await this.connectionPool.end();
  }

  async saveEvent(data: StoredEventData): Promise<void> {
    const query = this.queries.saveEvent(data);
    const queryResult = await this.connectionPool.query(query);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async findEvent(data: Partial<Pick<StoredEventData, 'id' | 'name' | 'hallId'>>): Promise<StoredEventData[]> {
    const query = this.queries.findEvent(data);
    const resultSet = await this.connectionPool.query(query);
    const eventDataSet = this.converters.toEventDataSet(resultSet);
    return eventDataSet;
  }

  async deleteEvent(eventId: string): Promise<void> {
    const query = this.queries.deleteEvent({ id: eventId });
    const queryResult = await this.connectionPool.query(query);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async saveHall(data: StoredHallData): Promise<void> {
    const query = this.queries.saveHall(data);
    const queryResult = await this.connectionPool.query(query);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async deleteHall(hallId: string): Promise<void> {
    const query = this.queries.deleteHall({ id: hallId });
    const queryResult = await this.connectionPool.query(query);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async saveTicket(data: StoredTicketData): Promise<void> {
    const query = this.queries.saveTicket(data);
    const queryResult = await this.connectionPool.query(query);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async findTicket(data: Partial<StoredTicketData>): Promise<StoredTicketData[]> {
    const query = this.queries.findTicket(data);
    const resultSet = await this.connectionPool.query(query);
    const ticketDataSet = this.converters.toTicketDataSet(resultSet);
    return ticketDataSet;
  }

  async deleteTicket(ticketId: string): Promise<void> {
    const query = this.queries.deleteTicket({ id: ticketId });
    const queryResult = await this.connectionPool.query(query);
    if (queryResult.affectedRows === 0) {
      throw new StorageError();
    }
  }

  async findHall(data: Partial<Omit<StoredHallData, 'layout'>>): Promise<StoredHallData[]> {
    const query = this.queries.findHall(data);
    const resultSet = await this.connectionPool.query(query);
    const hallDataSet = this.converters.toHallDataSet(resultSet);
    return hallDataSet;
  }
}
