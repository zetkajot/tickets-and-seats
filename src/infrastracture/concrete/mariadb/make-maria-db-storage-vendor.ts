import { PoolConfig, createPool, Pool } from 'mariadb';
import AsyncRethrower from '../../../utils/rethrow/async-rethrower';
import StorageError from '../../errors/storage-error';
import MariaDBStorageVendor from './mariadb-storage-vendor';
import makeDeleteQuery from './queries/make-delete-query';
import makeFindQuery from './queries/make-find-query';
import makeSaveQuery from './queries/make-save-query';
import resultSetToEventData from './result-converters/result-set-to-event-data';
import resultSetToHallData from './result-converters/result-set-to-hall-data';
import resultSetToTicketData from './result-converters/result-set-to-ticket-data';
import tableSchema from './table-schema';
import { QueryFactories } from './types/query-factories';
import { ResultSetConverters } from './types/result-set-converters';
import insertDummyData from './utils/insert-dummy-data';
import removeStoredData from './utils/remove-stored-data';

export default async function makeMariaDBStorageVendor(
  config: PoolConfig | Pool,
): Promise<MariaDBStorageVendor> {
  const connectionPool = 'query' in config ? config as Pool : createPool(config);
  injectErrorHandlerToConnectionPool(connectionPool);

  await createTables(connectionPool);

  if (process.env.NODE_ENV === 'test') {
    await setupTestEnvironment(connectionPool);
  }

  return new MariaDBStorageVendor(
    connectionPool,
    makeQueryFactories(),
    makeResultSetConverters(),
  );
}

function makeQueryFactories(): QueryFactories {
  return {
    deleteEvent: makeDeleteQuery.bind(null, 'event'),
    deleteHall: makeDeleteQuery.bind(null, 'hall'),
    deleteTicket: makeDeleteQuery.bind(null, 'ticket'),

    findEvent: makeFindQuery.bind(null, 'event'),
    findHall: makeFindQuery.bind(null, 'hall'),
    findTicket: makeFindQuery.bind(null, 'ticket'),

    saveEvent: makeSaveQuery.bind(null, 'event'),
    saveHall: makeSaveQuery.bind(null, 'hall'),
    saveTicket: makeSaveQuery.bind(null, 'ticket'),
  };
}

function makeResultSetConverters(): ResultSetConverters {
  return {
    toEventDataSet: resultSetToEventData,
    toHallDataSet: resultSetToHallData,
    toTicketDataSet: resultSetToTicketData,
  };
}

async function createTables(pool: Pool): Promise<void> {
  await pool.query(tableSchema.hall);
  await pool.query(tableSchema.event);
  await pool.query(tableSchema.ticket);
}

function injectErrorHandlerToConnectionPool(pool: Pool): void {
  Object.defineProperty(pool, 'realQuery', {
    value: pool.query.bind(pool),
  });
  Object.defineProperty(pool, 'query', {
    value: (...args: any[]) => {
      const context = new AsyncRethrower((pool as any).realQuery);
      context.addRethrow(Error, (error) => new StorageError(error.message));
      return context.asyncExecute(...args);
    },
  });
}

async function setupTestEnvironment(pool: Pool): Promise<void> {
  console.log('[INFO]MariaDB Storage Vendor running in TEST environment');
  await removeStoredData(pool);
  await insertDummyData(pool);
}
