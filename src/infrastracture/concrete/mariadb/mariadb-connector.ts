import { createPool, Pool, PoolConfig } from 'mariadb';
import StorageError from '../../errors/storage-error';

export default class MariaDBConnector {
  protected internalConnectionPool: Pool | undefined;

  public get connectionPool() {
    if (!this.internalConnectionPool) throw new StorageError();
    return this.internalConnectionPool;
  }

  constructor(private config: PoolConfig) {}

  public async start(
    setup?: (pool: Pool) => Promise<void>,
  ): Promise<void> {
    if (this.internalConnectionPool) throw new StorageError();
    this.internalConnectionPool = createPool(this.config);
    await this.internalConnectionPool.query('SELECT 1');
    if (setup) {
      await setup(this.internalConnectionPool);
    }
  }

  public async stop(cleanup?: (pool: Pool) => Promise<void>): Promise<void> {
    if (!this.internalConnectionPool) throw new StorageError();
    if (cleanup) {
      await cleanup(this.internalConnectionPool as Pool);
    }
    await (this.internalConnectionPool as Pool).end();
  }
}
