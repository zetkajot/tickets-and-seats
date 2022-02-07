/* eslint-disable @typescript-eslint/no-unused-expressions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from 'chai';
import CombinedStorageVendor from '../../../infrastracture/storage-vendors/combined-storage-vendor';
import DiscrepancyError from '../../use-case-utils/errors/discrapency-error';
import InvalidDataError from '../../use-case-utils/errors/invalid-data-error';
import AbstractEntityActionsFactory from './abstract-entity-actions-factory';

type EntityActionsFactoryConstructor<T, U> = {
  new(sv: CombinedStorageVendor): AbstractEntityActionsFactory<T, U>,
};
const uselessStorageVendor: CombinedStorageVendor = {
  deleteEvent: async () => undefined,
  deleteHall: async () => undefined,
  saveEvent: async () => undefined,
  findEvent: async () => undefined,
  saveHall: async () => undefined,
  findHall: async () => undefined,
  saveTicket: async () => undefined,
  findTicket: async () => undefined,
  deleteTicket: async () => undefined,
} as unknown as CombinedStorageVendor;

function setFindMethods(fn: (...args: any) => Promise<any>) {
  return {
    ...Object.create(uselessStorageVendor),
    findEvent: fn,
    findHall: fn,
    findTicket: fn,
  } as CombinedStorageVendor;
}

export default function testEntityActionsFactory<Entity, EntityData>(
  Factory: EntityActionsFactoryConstructor<Entity, EntityData>,
  exampleEntity: Entity,
  exampleEntityData: EntityData,
  exampleParams: Partial<EntityData>,
  exampleUniqueIdentifier: any,
) {
  describe('Product of makeFindMany()', () => {
    it('Calls one of the \'find\' prefixed methods on \'CombinedStorageVendor\'', async () => {
      let wasFindMethodCalled = false;
      const spiedVendor: CombinedStorageVendor = {
        ...Object.create(uselessStorageVendor),
        findEvent: () => { wasFindMethodCalled = true; },
        findHall: () => { wasFindMethodCalled = true; },
        findTicket: () => { wasFindMethodCalled = true; },
      };
      const findMany = new Factory(spiedVendor).makeFindMany();
      await findMany(exampleParams);

      expect(wasFindMethodCalled).to.be.true;
    });
    describe('When no entities match given params', () => {
      it('Returns empty array', async () => {
        const vendor = setFindMethods(async () => []);
        const findMany = new Factory(vendor).makeFindMany();

        const result = await findMany(exampleParams);

        expect(result).to.deep.equal([]);
      });
    });
    describe('When exactly one entity matches given params', () => {
      it('Returns array with one entity', async () => {
        const vendor = setFindMethods(async () => [exampleEntityData]);
        const findMany = new Factory(vendor).makeFindMany();

        const result = await findMany(exampleParams);

        expect(result).to.deep.equal([exampleEntity]);
      });
    });
    describe('When more than one entities match given params', () => {
      it('Returns array of mulitple entities', async () => {
        const vendor = setFindMethods(async () => [exampleEntityData, exampleEntityData]);
        const findMany = new Factory(vendor).makeFindMany();

        const result = await findMany(exampleParams);

        expect(result).to.deep.equal([exampleEntity, exampleEntity]);
      });
    });
  });
  describe('Product of makeFindManyRelated()', () => {
    it('Calls one of the \'find\' prefixed methods on \'CombinedStorageVendor\'', async () => {
      let wasFindMethodCalled = false;
      const spiedVendor: CombinedStorageVendor = {
        ...Object.create(uselessStorageVendor),
        findEvent: async () => { wasFindMethodCalled = true; },
        findHall: async () => { wasFindMethodCalled = true; },
        findTicket: async () => { wasFindMethodCalled = true; },
      };
      const findManyRelated = new Factory(spiedVendor).makeFindManyRelated();
      await findManyRelated(exampleParams);

      expect(wasFindMethodCalled).to.be.true;
    });
    describe('When no entities match given params', () => {
      it('Throws DiscrepancyError', () => {
        const vendor = setFindMethods(async () => []);
        const findManyRelated = new Factory(vendor).makeFindManyRelated();

        return expect(findManyRelated(exampleParams))
          .to.eventually.be.rejectedWith(DiscrepancyError);
      });
    });
    describe('When exactly one entity matches given params', () => {
      it('Returns array with one entity', async () => {
        const vendor = setFindMethods(async () => [exampleEntityData]);
        const findManyRelated = new Factory(vendor).makeFindManyRelated();

        const result = await findManyRelated(exampleParams);

        expect(result).to.deep.equal([exampleEntity]);
      });
    });
    describe('When more than one entities match given params', () => {
      it('Returns array of mulitple entities', async () => {
        const vendor = setFindMethods(async () => [exampleEntityData, exampleEntityData]);
        const findManyRelated = new Factory(vendor).makeFindManyRelated();

        const result = await findManyRelated(exampleParams);

        expect(result).to.deep.equal([exampleEntity, exampleEntity]);
      });
    });
  });
  describe('Product of makeFindUnique()', () => {
    it('Calls one of the \'find\' prefixed methods on \'CombinedStorageVendor\'', async () => {
      let wasFindMethodCalled = false;
      const spiedVendor: CombinedStorageVendor = {
        ...Object.create(uselessStorageVendor),
        findEvent: async () => { wasFindMethodCalled = true; return [exampleEntityData]; },
        findHall: async () => { wasFindMethodCalled = true; return [exampleEntityData]; },
        findTicket: async () => { wasFindMethodCalled = true; return [exampleEntityData]; },
      };
      const findUnique = new Factory(spiedVendor).makeFindUnique();
      await findUnique(exampleParams);

      expect(wasFindMethodCalled).to.be.true;
    });
    describe('When no entities match given param', () => {
      it('Throws InvalidDataError', () => {
        const vendor = setFindMethods(async () => []);
        const findUnique = new Factory(vendor).makeFindUnique();

        return expect(findUnique(exampleUniqueIdentifier))
          .to.eventually.be.rejectedWith(InvalidDataError);
      });
    });
    describe('When exactly one entity matches given param', () => {
      it('Returns matching entity', async () => {
        const vendor = setFindMethods(async () => [exampleEntityData]);
        const findUnique = new Factory(vendor).makeFindUnique();

        const output = await findUnique(exampleUniqueIdentifier);

        expect(output).to.deep.equal([exampleEntity]);
      });
    });
    describe('When more than one entities match given param', () => {
      it('Throws DiscrepancyError', () => {
        const vendor = setFindMethods(async () => [exampleEntityData, exampleEntityData]);
        const findUnique = new Factory(vendor).makeFindUnique();

        return expect(findUnique(exampleUniqueIdentifier))
          .to.eventually.be.rejectedWith(InvalidDataError);
      });
    });
  });
  describe('Product of makeFindUniqueRelated()', () => {
    it('Calls one of the \'find\' prefixed methods on \'CombinedStorageVendor\'', async () => {
      let wasFindMethodCalled = false;
      const spiedVendor: CombinedStorageVendor = {
        ...Object.create(uselessStorageVendor),
        findEvent: async () => { wasFindMethodCalled = true; return [exampleEntityData]; },
        findHall: async () => { wasFindMethodCalled = true; return [exampleEntityData]; },
        findTicket: async () => { wasFindMethodCalled = true; return [exampleEntityData]; },
      };
      const findUniqueRelated = new Factory(spiedVendor).makeFindUniqueRelated();
      await findUniqueRelated(exampleParams);

      expect(wasFindMethodCalled).to.be.true;
    });
    describe('When no entities match given param', () => {
      it('Throws DiscrepancyError', () => {
        const vendor = setFindMethods(async () => []);
        const findUniqueRelated = new Factory(vendor).makeFindUniqueRelated();

        return expect(findUniqueRelated(exampleUniqueIdentifier))
          .to.eventually.be.rejectedWith(DiscrepancyError);
      });
    });
    describe('When exactly one entity matches given param', () => {
      it('Returns matching entity', async () => {
        const vendor = setFindMethods(async () => [exampleEntityData]);
        const findUniqueRelated = new Factory(vendor).makeFindUniqueRelated();

        const result = await findUniqueRelated(exampleParams);

        expect(result).to.deep.equal([exampleEntity]);
      });
    });
    describe('When more than one entities match given param', () => {
      it('Throws DiscrepancyError', () => {
        const vendor = setFindMethods(async () => [exampleEntityData, exampleEntityData]);
        const findUniqueRelated = new Factory(vendor).makeFindUniqueRelated();

        return expect(findUniqueRelated(exampleUniqueIdentifier))
          .to.eventually.be.rejectedWith(DiscrepancyError);
      });
    });
  });
  describe('Product of makeDeleteOne()', () => {
    it('Calls one of the \'delete\' prefixed methods on \'CombinedStorageVendor\'', async () => {
      let wasDeleteMethodCalled = false;
      const spiedVendor: CombinedStorageVendor = {
        ...Object.create(uselessStorageVendor),
        deleteEvent: () => { wasDeleteMethodCalled = true; },
        deleteHall: () => { wasDeleteMethodCalled = true; },
        deleteTicket: () => { wasDeleteMethodCalled = true; },
      };
      const deleteOne = new Factory(spiedVendor).makeDeleteOne();
      await deleteOne(exampleEntity);

      expect(wasDeleteMethodCalled).to.be.true;
    });
  });
  describe('Product of makeSaveOne()', () => {
    it('Calls one of the \'save\' prefixed methods on \'CombinedStorageVendor\'', async () => {
      let wasSaveMethodCalled = false;
      const spiedVendor: CombinedStorageVendor = {
        ...Object.create(uselessStorageVendor),
        saveEvent: () => { wasSaveMethodCalled = true; },
        saveHall: () => { wasSaveMethodCalled = true; },
        saveTicket: () => { wasSaveMethodCalled = true; },
      };
      const saveOne = new Factory(spiedVendor).makeSaveOne();
      await saveOne(exampleEntity);

      expect(wasSaveMethodCalled).to.be.true;
    });
  });
}
