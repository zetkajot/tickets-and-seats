import { expect } from 'chai';
import Sinon from 'sinon';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import DeleteEvent from './delete-event';

const dummyEventData = {
  id: 'some-data',
  endsAt: new Date('2021'),
  hallId: 'some-hall',
  isOpen: true,
  reservedSeats: [],
  name: 'a name',
  startsAt: new Date('2020'),
} as StoredEventData;

describe('Delete Event Use Case test suite', () => {
  describe('When provided with id of nonexistent event', () => {
    it('Throws InvalidDataError.ENTITY_NOT_FOUND', () => {
      const storageVendor = { findEvent: async () => [] } as unknown as CombinedStorageVendor;
      const deleteEvent = new DeleteEvent(storageVendor);

      return expect(deleteEvent.execute({ eventId: 'non-existent-id' }))
        .to.eventually.be.rejectedWith(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.ENTITY_NOT_FOUND);
    });
  });
  describe('When provided with id of existing event', () => {
    it('Deletes event via storage vendor', async () => {
      const storageVendor = {
        findEvent: async () => [dummyEventData],
        deleteEvent: Sinon.spy(async () => undefined),
      } as unknown as CombinedStorageVendor;
      const deleteEvent = new DeleteEvent(storageVendor);

      await deleteEvent.execute({ eventId: 'existing-event-id' });

      expect(storageVendor.deleteEvent)
        .to.have.been.calledOnceWithExactly('some-data');
    });
    it('Returns info about deleted event', async () => {
      const storageVendor = {
        findEvent: async () => [dummyEventData],
        deleteEvent: async () => undefined,
      } as unknown as CombinedStorageVendor;
      const deleteEvent = new DeleteEvent(storageVendor);

      const result = await deleteEvent.execute({ eventId: 'existing-event-id' });

      expect(result).to.deep.equal({
        eventId: 'some-data',
        hallId: 'some-hall',
        name: 'a name',
      });
    });
  });
});
