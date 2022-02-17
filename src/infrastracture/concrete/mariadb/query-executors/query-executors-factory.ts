/* eslint-disable class-methods-use-this */
import { Pool } from 'mariadb';
import DeleteQueryBuilder from '../query-creator/concrete-builders/delete-query-builder';
import InsertQueryBuilder from '../query-creator/concrete-builders/insert-query-builder';
import SelectQueryBuilder from '../query-creator/concrete-builders/select-query-builder';
import QueryCreationDirector from '../query-creator/query-creation-director';
import sanitizeEventData from '../query-data-sanitizers/sanitize-event-data';
import sanitizeHallData from '../query-data-sanitizers/sanitize-hall-data';
import sanitizeTicketData from '../query-data-sanitizers/sanitize-ticket-data';
import resultSetToEventData from '../result-converters/result-set-to-event-data';
import resultSetToHallData from '../result-converters/result-set-to-hall-data';
import resultSetToTicketData from '../result-converters/result-set-to-ticket-data';
import QueryExecutor from './query-executor';
import { EventQueryExecutor } from './types/event-query-executor';
import { HallQueryExecutor } from './types/hall-query-executor';
import { QueryCreators } from './types/query-creators';
import { TicketQueryExecutor } from './types/ticket-query-executor';

export default class QueryExecutorsFactory {
  makeEventQueryExecutor(pool: Pool): EventQueryExecutor {
    return new QueryExecutor(
      'event',
      pool,
      queryCreators,
      sanitizeEventData,
      resultSetToEventData,
    );
  }

  makeTicketQueryExecutor(pool: Pool): TicketQueryExecutor {
    return new QueryExecutor(
      'ticket',
      pool,
      queryCreators,
      sanitizeTicketData,
      resultSetToTicketData,
    );
  }

  makeHallQueryExecutor(pool: Pool): HallQueryExecutor {
    return new QueryExecutor(
      'hall',
      pool,
      queryCreators,
      sanitizeHallData,
      resultSetToHallData,
    );
  }
}

const queryCreators: QueryCreators = {
  deleteQueryCreator: new QueryCreationDirector(new DeleteQueryBuilder()),
  selectQueryCreator: new QueryCreationDirector(new SelectQueryBuilder()),
  insertQueryCreator: new QueryCreationDirector(new InsertQueryBuilder()),
};
