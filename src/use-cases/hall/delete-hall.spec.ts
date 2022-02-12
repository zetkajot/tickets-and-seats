import { expect } from 'chai';
import Sinon from 'sinon';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import DeleteHall from './delete-hall';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import makeDummyHall from '../use-case-utils/dummies/make-dummy-hall';
import deconstructHall from '../use-case-utils/deconstructors/deconstruct-hall';

const dummyHall = makeDummyHall({
  id: 'some-hall-id',
  name: 'some hall',
});

const dummyHallData = deconstructHall(dummyHall);

describe('Delete Hall Use Case test suite', () => {
  describe('When provided with id of nonexistent hall', () => {
    it('Throws InvalidDataError.ENTITY_NOT_FOUND', () => {
      const sv = { findHall: async () => [] } as unknown as CombinedStorageVendor;
      const deleteHall = new DeleteHall(sv);

      expect(deleteHall.execute({ hallId: 'nonexistent-hall-id' }))
        .to.eventually.be.rejectedWith(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.ENTITY_NOT_FOUND);
    });
  });
  describe('When provided with if of existing hall', () => {
    it('Returns deleted hall info', async () => {
      const sv = {
        findHall: async () => [dummyHallData],
        deleteHall: async () => undefined,
      } as unknown as CombinedStorageVendor;
      const deleteHall = new DeleteHall(sv);

      const output = await deleteHall.execute({ hallId: 'some-hall-id' });

      expect(output).to.deep.equal({
        hallId: 'some-hall-id',
        hallName: 'some hall',
      });
    });
    it('Deletes hall via storage vendor', async () => {
      const sv = {
        findHall: async () => [dummyHallData],
        deleteHall: Sinon.spy(async () => undefined),
      } as unknown as CombinedStorageVendor;
      const deleteHall = new DeleteHall(sv);

      await deleteHall.execute({ hallId: 'some-hall-id' });

      expect(sv.deleteHall).to.have.been.calledOnceWithExactly('some-hall-id');
    });
  });
});
