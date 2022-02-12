import { expect } from 'chai';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import FindEventById from './find-event-by-id';

const validEventData = Object.freeze({
  id: 'event id',
  name: 'example event',
  hallId: 'hall id',
  startsAt: new Date('2020'),
  endsAt: new Date('2021'),
  isOpen: false,
  reservedSeats: [],
});

const validHallData = Object.freeze({
  id: 'hall id',
  name: 'example hall',
  layout: [[1, 0, 0]],
});

const validDataVendor = {
  findHall: async () => [validHallData],
  findEvent: async () => [validEventData],
} as unknown as CombinedStorageVendor;

let dataVendor: CombinedStorageVendor = Object.create(validDataVendor);

describe('Find Event By Id Use Case test suite', () => {
  beforeEach(() => {
    dataVendor = Object.create(validDataVendor);
  });
  describe('When provided with id of non existing event', () => {
    it('Throws InvalidDataError', () => {
      dataVendor.findEvent = async () => [];
      const useCase = new FindEventById(dataVendor);

      const tryFindingEvent = () => useCase.execute({ eventId: 'event id' });

      return expect(tryFindingEvent())
        .to.eventually.be.rejected
        .and.to.be.an.instanceOf(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.ENTITY_NOT_FOUND);
    });
  });
  describe('When provided with id of existing event', () => {
    it('Returns data matching specified output type', async () => {
      const useCase = new FindEventById(dataVendor);

      const output = await useCase.execute({ eventId: 'event id' });

      expect(output).to.deep.equal({
        eventId: 'event id',
        eventName: 'example event',
        hallName: 'example hall',
        startingDate: new Date('2020'),
        endingDate: new Date('2021'),
        isOpen: false,
      });
    });
  });
});
