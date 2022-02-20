import { expect } from 'chai';
import { Pool } from 'mariadb';
import Sinon from 'sinon';
import MariaDBConnector from './mariadb-connector';
import StorageError from '../../errors/storage-error';
import ConfigSingleton from '../../../utils/config-singleton';

class ExposedConnector extends MariaDBConnector {
  public setInternalConnectionPool(pool: Pool): void {
    this.internalConnectionPool = pool;
  }

  public getInternalConnectionPool(): Pool | undefined {
    return this.internalConnectionPool;
  }
}

const { mariadbConfig } = ConfigSingleton.getConfig();

let connector: MariaDBConnector;
const spiedMethod = Sinon.spy();
describe('MariaDB Connector test suite', () => {
  describe('When starting a stopped connector', () => {
    before(async () => {
      Sinon.reset();
      connector = new ExposedConnector(mariadbConfig);
      await connector.start(spiedMethod);
    });
    it('Should initialize connection pool', async () => {
      expect((connector as ExposedConnector).getInternalConnectionPool())
        .to.not.equal(undefined);
    });
    it('Should execute passed setup function', () => {
      expect(spiedMethod)
        .to.have.been.calledOnceWithExactly(
          (connector as ExposedConnector).getInternalConnectionPool(),
        );
    });
    after(async () => {
      await connector.stop();
    });
  });
  describe('When stopping a started connector', () => {
    const spiedInternalPool: Pool = { end: Sinon.spy(async () => {}) } as unknown as Pool;
    let originalPool: Pool;
    before(async () => {
      Sinon.reset();
      connector = new ExposedConnector(mariadbConfig);
      await connector.start();
      originalPool = (connector as ExposedConnector).getInternalConnectionPool() as Pool;
      (connector as ExposedConnector).setInternalConnectionPool(spiedInternalPool);
      await connector.stop(spiedMethod);
    });
    it('Should close the connection pool', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(spiedInternalPool.end).to.have.been.calledOnce;
    });
    it('Should execute passed cleanup function', () => {
      expect(spiedMethod).to.have.been.calledOnceWithExactly(spiedInternalPool);
    });
    after(async () => {
      await originalPool.end();
    });
  });
  describe('When trying to get connectionPool when connector is stopped', () => {
    before(async () => {
      Sinon.reset();
      connector = new ExposedConnector(mariadbConfig);
    });
    it('Should throw an error', () => {
      const tryGettingConnectionPool = () => connector.connectionPool;
      expect(tryGettingConnectionPool).to.throw(StorageError);
    });
  });
  describe('When trying to stop a connector that has not been started', () => {
    before(async () => {
      connector = new MariaDBConnector(mariadbConfig);
    });
    it('Should throw an errror', () => expect(connector.stop())
      .to.eventually.be.rejectedWith(StorageError));
  });
  describe('When trying to start a connector that has not been stopped', () => {
    before(async () => {
      connector = new MariaDBConnector(mariadbConfig);
      await connector.start();
    });
    it('Should throw an error', () => expect(connector.start())
      .to.eventually.be.rejectedWith(StorageError));
    after(async () => {
      await connector.stop();
    });
  });
});
