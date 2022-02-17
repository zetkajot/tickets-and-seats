import { Pool } from 'mariadb';
import StorageError from '../../../errors/storage-error';
import { QueryCreators } from './query-creators';

export default class ExecutorTemplate<QueryData, QueryResult, QueryOutput> {
  constructor(
    private entityTableName: string,
    private connectionPool: Pool,
    private queryCreators: QueryCreators,
    private dataSanitizer: (data: QueryData)=>Record<string, any>,
    private queryResultConverter: (result: QueryResult) => QueryOutput,
  ) {

  }

  async executeSelectQuery(data: QueryData): Promise<QueryOutput> {
    const sanitizedData = this.dataSanitizer(data);
    const { query, values } = this.queryCreators.selectQueryCreator.createQuery(
      this.entityTableName,
      sanitizedData,
    );
    const queryResult = await this.connectionPool.query(query, values);
    return this.queryResultConverter(queryResult);
  }

  async executeInsertQuery(data: QueryData): Promise<void> {
    const sanitizedData = this.dataSanitizer(data);
    const { query, values } = this.queryCreators.insertQueryCreator.createQuery(
      this.entityTableName,
      sanitizedData,
    );
    const queryResult = await this.connectionPool.query(query, values);
    if (queryResult.affectedRows === 0) throw new StorageError();
  }

  async executeDeleteQuery(data: QueryData): Promise<void> {
    const sanitizedData = this.dataSanitizer(data);
    const { query, values } = this.queryCreators.deleteQueryCreator.createQuery(
      this.entityTableName,
      sanitizedData,
    );
    const queryResult = await this.connectionPool.query(query, values);
    if (queryResult.affectedRows === 0) throw new StorageError();
  }
}
