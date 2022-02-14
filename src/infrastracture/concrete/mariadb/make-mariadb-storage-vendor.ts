import { PoolConfig } from 'mariadb';
import MariaDBStorageVendor from './mariadb-storage-vendor';
import makeDeleteQuery from './queries/make-delete-query';
import makeFindQuery from './queries/make-find-query';
import makeSaveQuery from './queries/make-save-query';
import resultSetToEventData from './result-converters/result-set-to-event-data';
import resultSetToHallData from './result-converters/result-set-to-hall-data';
import resultSetToTicketData from './result-converters/result-set-to-ticket-data';
import { QueryFactories } from './types/query-factories';
import { ResultSetConverters } from './types/result-set-converters';
import insertDummyData from './utils/insert-dummy-data';

export default async function makeMariaDBStorageVendor(
  config: PoolConfig,
  environment: 'TEST' | 'PRODUCTION' = 'PRODUCTION',
): Promise<MariaDBStorageVendor> {
  const sv = await MariaDBStorageVendor.init(
    config,
    queryFactories,
    converters,
    optionsLookup[environment],
  );

  if (environment === 'TEST') {
    await insertDummyData(sv.connectionPool);
  }

  return sv;
}

const optionsLookup = {
  TEST: {
    dropTablesOnShutdown: true,
    removeDataOnShutdown: true,
    removeDataOnStart: true,
    skipTableInitialization: false,
  },
  PRODUCTION: {
    dropTablesOnShutdown: false,
    removeDataOnShutdown: false,
    removeDataOnStart: false,
    skipTableInitialization: false,
  },
};

const queryFactories: QueryFactories = {
  findHall: makeFindQuery.bind(null, 'Hall'),
  findEvent: makeFindQuery.bind(null, 'Event'),
  findTicket: makeFindQuery.bind(null, 'Ticket'),
  deleteHall: makeDeleteQuery.bind(null, 'Hall'),
  deleteEvent: makeDeleteQuery.bind(null, 'Event'),
  deleteTicket: makeDeleteQuery.bind(null, 'Ticket'),
  saveHall: makeSaveQuery.bind(null, 'Hall'),
  saveEvent: makeSaveQuery.bind(null, 'Event'),
  saveTicket: makeSaveQuery.bind(null, 'Ticket'),
};

const converters: ResultSetConverters = {
  toEventDataSet: resultSetToEventData,
  toHallDataSet: resultSetToHallData,
  toTicketDataSet: resultSetToTicketData,
};
