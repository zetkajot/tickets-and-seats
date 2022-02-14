import { expect } from 'chai';
import { Pool } from 'mariadb';
import Sinon from 'sinon';
import MariaDBStorageVendor from './mariadb-storage-vendor';
import { QueryFactories } from './types/query-factories';
import { ResultSetConverters } from './types/result-set-converters';
import StorageError from '../../errors/storage-error';

const spiedConverters = makeSpiedConverters();
const spiedQueryFactories = makeSpiedQueryFactories();
const spiedFindQueryExecutor = Sinon.spy(async () => ['query', 'result']);
const spiedModifyQueryExecutor = {
  affecting: Sinon.spy(async () => ({ affectedRows: 1 })),
  nonAffecting: Sinon.spy(async () => ({ affectedRows: 0 })),
};

const spiedPool = { query: spiedFindQueryExecutor } as unknown as Pool;

const SpiedMariaDBSV = class extends MariaDBStorageVendor {
  public static async initSpied(
    pool: Pool,
    queries: QueryFactories,
    converters: ResultSetConverters,
    userOptions?: any,
  ) {
    const options = {
      dropTablesOnShutdown: false,
      removeDataOnShutdown: false,
      removeDataOnStart: false,
      skipTableInitialization: false,
      ...userOptions,
    };
    const sv = new SpiedMariaDBSV(pool, queries, converters, options);
    if (!options.skipTableInitialization) {
      await MariaDBStorageVendor.initializeTables(pool);
    }
    if (options.removeDataOnStart) {
      await MariaDBStorageVendor.clearTableData(pool);
    }
    return sv;
  }
};

describe('MariaDB Storage Vendor test suite', () => {
  beforeEach(() => {
    Sinon.reset();
  });
  describe('findHall method', () => {
    let vendor: MariaDBStorageVendor;
    before(async () => {
      vendor = await SpiedMariaDBSV.initSpied(
        spiedPool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await vendor.findHall({});
      expect(spiedQueryFactories.findHall)
        .to.have.been.calledOnceWithExactly({});
    });
    it('Executes query via query() method on connectionPool', async () => {
      await vendor.findHall({});
      expect(spiedFindQueryExecutor).to.have.been.calledOnceWithExactly('example query');
    });
    it('Converts result using appropiate converter', async () => {
      await vendor.findHall({});
      expect(spiedConverters.toHallDataSet).to.have.been.calledOnceWithExactly(['query', 'result']);
    });
    it('Returns converted data', async () => {
      const result = await vendor.findHall({});
      expect(result).to.deep.equal(['converted', 'result']);
    });
  });
  describe('findEvent method', async () => {
    let vendor: MariaDBStorageVendor;
    before(async () => {
      vendor = await SpiedMariaDBSV.initSpied(
        spiedPool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await vendor.findEvent({});
      expect(spiedQueryFactories.findEvent)
        .to.have.been.calledOnceWithExactly({});
    });
    it('Executes query via query() method on connectionPool', async () => {
      await vendor.findEvent({});
      expect(spiedFindQueryExecutor).to.have.been.calledOnceWithExactly('example query');
    });
    it('Converts result using appropiate converter', async () => {
      await vendor.findEvent({});
      expect(spiedConverters.toEventDataSet)
        .to.have.been.calledOnceWithExactly(['query', 'result']);
    });
    it('Returns converted data', async () => {
      const result = await vendor.findEvent({});
      expect(result).to.deep.equal(['converted', 'result']);
    });
  });
  describe('findTicket method', () => {
    let vendor: MariaDBStorageVendor;
    before(async () => {
      vendor = await SpiedMariaDBSV.initSpied(
        spiedPool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await vendor.findTicket({});
      expect(spiedQueryFactories.findTicket)
        .to.have.been.calledOnceWithExactly({});
    });
    it('Executes query via query() method on connectionPool', async () => {
      await vendor.findTicket({});
      expect(spiedFindQueryExecutor).to.have.been.calledOnceWithExactly('example query');
    });
    it('Converts result using appropiate converter', async () => {
      await vendor.findTicket({});
      expect(spiedConverters.toTicketDataSet)
        .to.have.been.calledOnceWithExactly(['query', 'result']);
    });
    it('Returns converted data', async () => {
      const result = await vendor.findTicket({});
      expect(result).to.deep.equal(['converted', 'result']);
    });
  });

  describe('saveHall method', () => {
    let affectingVendor: MariaDBStorageVendor;
    let nonAffectingVendor: MariaDBStorageVendor;
    before(async () => {
      affectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.affecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
      nonAffectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.nonAffecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await affectingVendor.saveHall({} as any);
      expect(spiedQueryFactories.saveHall)
        .to.have.been.calledOnceWithExactly({});
    });
    it('Executes query via query() method on connectionPool', async () => {
      await affectingVendor.saveHall({} as any);
      expect(spiedModifyQueryExecutor.affecting)
        .to.have.been.calledOnceWithExactly('example query');
    });
    describe('When no rows were affected', () => {
      it('Throws StorageError', () => {
        const tryCalling = () => nonAffectingVendor.saveHall({} as any);

        return expect(tryCalling()).to.eventually.be.rejectedWith(StorageError);
      });
    });
    describe('When at least one row was affected', () => {
      it('Does not throw StorageError', () => {
        const tryCalling = () => affectingVendor.saveHall({} as any);

        return expect(tryCalling()).to.eventually.not.be.rejectedWith(StorageError);
      });
    });
  });
  describe('saveEvent method', () => {
    let affectingVendor: MariaDBStorageVendor;
    let nonAffectingVendor: MariaDBStorageVendor;
    before(async () => {
      affectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.affecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
      nonAffectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.nonAffecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await affectingVendor.saveEvent({} as any);
      expect(spiedQueryFactories.saveEvent)
        .to.have.been.calledOnceWithExactly({});
    });
    it('Executes query via query() method on connectionPool', async () => {
      await affectingVendor.saveEvent({} as any);
      expect(spiedModifyQueryExecutor.affecting)
        .to.have.been.calledOnceWithExactly('example query');
    });
    describe('When no rows were affected', () => {
      it('Throws StorageError', () => {
        const tryCalling = () => nonAffectingVendor.saveEvent({} as any);

        return expect(tryCalling()).to.eventually.be.rejectedWith(StorageError);
      });
    });
    describe('When at least one row was affected', () => {
      it('Does not throw StorageError', () => {
        const tryCalling = () => affectingVendor.saveEvent({} as any);

        return expect(tryCalling()).to.eventually.not.be.rejectedWith(StorageError);
      });
    });
  });
  describe('saveTicket method', () => {
    let affectingVendor: MariaDBStorageVendor;
    let nonAffectingVendor: MariaDBStorageVendor;
    before(async () => {
      affectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.affecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
      nonAffectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.nonAffecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await affectingVendor.saveTicket({} as any);
      expect(spiedQueryFactories.saveTicket)
        .to.have.been.calledOnceWithExactly({});
    });
    it('Executes query via query() method on connectionPool', async () => {
      await affectingVendor.saveTicket({} as any);
      expect(spiedModifyQueryExecutor.affecting)
        .to.have.been.calledOnceWithExactly('example query');
    });
    describe('When no rows were affected', () => {
      it('Throws StorageError', () => {
        const tryCalling = () => nonAffectingVendor.saveTicket({} as any);

        return expect(tryCalling()).to.eventually.be.rejectedWith(StorageError);
      });
    });
    describe('When at least one row was affected', () => {
      it('Does not throw StorageError', () => {
        const tryCalling = () => affectingVendor.saveTicket({} as any);

        return expect(tryCalling()).to.eventually.not.be.rejectedWith(StorageError);
      });
    });
  });

  describe('deleteHall method', () => {
    let affectingVendor: MariaDBStorageVendor;
    let nonAffectingVendor: MariaDBStorageVendor;
    before(async () => {
      affectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.affecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
      nonAffectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.nonAffecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await affectingVendor.deleteHall({} as any);
      expect(spiedQueryFactories.deleteHall)
        .to.have.been.calledOnceWithExactly({ id: {} });
    });
    it('Executes query via query() method on connectionPool', async () => {
      await affectingVendor.deleteHall({} as any);
      expect(spiedModifyQueryExecutor.affecting)
        .to.have.been.calledOnceWithExactly('example query');
    });
    describe('When no rows were affected', () => {
      it('Throws StorageError', () => {
        const tryCalling = () => nonAffectingVendor.deleteHall({} as any);

        return expect(tryCalling()).to.eventually.be.rejectedWith(StorageError);
      });
    });
    describe('When at least one row was affected', () => {
      it('Does not throw StorageError', () => {
        const tryCalling = () => affectingVendor.deleteHall({} as any);

        return expect(tryCalling()).to.eventually.not.be.rejectedWith(StorageError);
      });
    });
  });
  describe('deleteEvent method', () => {
    let affectingVendor: MariaDBStorageVendor;
    let nonAffectingVendor: MariaDBStorageVendor;
    before(async () => {
      affectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.affecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
      nonAffectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.nonAffecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await affectingVendor.deleteEvent({} as any);
      expect(spiedQueryFactories.deleteEvent)
        .to.have.been.calledOnceWithExactly({ id: {} });
    });
    it('Executes query via query() method on connectionPool', async () => {
      await affectingVendor.deleteEvent({} as any);
      expect(spiedModifyQueryExecutor.affecting)
        .to.have.been.calledOnceWithExactly('example query');
    });
    describe('When no rows were affected', () => {
      it('Throws StorageError', () => {
        const tryCalling = () => nonAffectingVendor.deleteEvent({} as any);

        return expect(tryCalling()).to.eventually.be.rejectedWith(StorageError);
      });
    });
    describe('When at least one row was affected', () => {
      it('Does not throw StorageError', () => {
        const tryCalling = () => affectingVendor.deleteEvent({} as any);

        return expect(tryCalling()).to.eventually.not.be.rejectedWith(StorageError);
      });
    });
  });
  describe('deleteTicket method', () => {
    let affectingVendor: MariaDBStorageVendor;
    let nonAffectingVendor: MariaDBStorageVendor;
    before(async () => {
      affectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.affecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
      nonAffectingVendor = await SpiedMariaDBSV.initSpied(
        { query: spiedModifyQueryExecutor.nonAffecting } as unknown as Pool,
        spiedQueryFactories,
        spiedConverters,
      );
    });
    it('Prepares query by calling corresponding query factory using given data', async () => {
      await affectingVendor.deleteTicket({} as any);
      expect(spiedQueryFactories.deleteTicket)
        .to.have.been.calledOnceWithExactly({ id: {} });
    });
    it('Executes query via query() method on connectionPool', async () => {
      await affectingVendor.deleteTicket({} as any);
      expect(spiedModifyQueryExecutor.affecting)
        .to.have.been.calledOnceWithExactly('example query');
    });
    describe('When no rows were affected', () => {
      it('Throws StorageError', () => {
        const tryCalling = () => nonAffectingVendor.deleteTicket({} as any);

        return expect(tryCalling()).to.eventually.be.rejectedWith(StorageError);
      });
    });
    describe('When at least one row was affected', () => {
      it('Does not throw StorageError', () => {
        const tryCalling = () => affectingVendor.deleteTicket({} as any);

        return expect(tryCalling()).to.eventually.not.be.rejectedWith(StorageError);
      });
    });
  });
});

function makeSpiedQueryFactories(): QueryFactories {
  return {
    findHall: Sinon.spy(() => 'example query'),
    findEvent: Sinon.spy(() => 'example query'),
    findTicket: Sinon.spy(() => 'example query'),

    deleteEvent: Sinon.spy(() => 'example query'),
    deleteHall: Sinon.spy(() => 'example query'),
    deleteTicket: Sinon.spy(() => 'example query'),

    saveEvent: Sinon.spy(() => 'example query'),
    saveHall: Sinon.spy(() => 'example query'),
    saveTicket: Sinon.spy(() => 'example query'),
  };
}

function makeSpiedConverters(): ResultSetConverters {
  return {
    toEventDataSet: Sinon.spy(() => ['converted', 'result']),
    toHallDataSet: Sinon.spy(() => ['converted', 'result']),
    toTicketDataSet: Sinon.spy(() => ['converted', 'result']),
  } as unknown as ResultSetConverters;
}
