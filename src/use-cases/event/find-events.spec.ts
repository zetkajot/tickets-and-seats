import { expect } from 'chai';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import FindEvents from './find-events';

const dummyEventData = {
  id: 'event-id',
  name: 'my event',
  startsAt: new Date('2092'),
  endsAt: new Date('2102'),
  hallId: 'some-hall',
  isOpen: true,
  reservedSeats: [],
} as StoredEventData;

describe('Find Events Use Case test suite', () => {
  describe('When no event matches given input data', () => {
    it('Returns an empty array', async () => {
      const storageVendor = { findEvent: async () => [] } as unknown as CombinedStorageVendor;
      const findEvents = new FindEvents(storageVendor);

      const result = await findEvents.execute({ hallId: 'not matching', name: 'not matching either' });

      expect(result).to.deep.equal([]);
    });
  });
  describe('When at least one event matches given input data', () => {
    it('Returns an array of results', async () => {
      const storageVendor = {
        findEvent: async () => [
          dummyEventData,
          dummyEventData,
        ],
      } as unknown as CombinedStorageVendor;
      const findEvents = new FindEvents(storageVendor);

      const result = await findEvents.execute({ hallId: 'not matching', name: 'not matching either' });

      expect(result).to.deep.equal([{
        eventId: 'event-id',
        eventName: 'my event',
        startingDate: new Date('2092'),
        endingDate: new Date('2102'),
        hallId: 'some-hall',
        isOpen: true,
      }, {
        eventId: 'event-id',
        eventName: 'my event',
        startingDate: new Date('2092'),
        endingDate: new Date('2102'),
        hallId: 'some-hall',
        isOpen: true,
      }]);
    });
  });
});
