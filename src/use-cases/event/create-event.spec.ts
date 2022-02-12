import { expect } from 'chai';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import CreateEvent from './create-event';

const validHallData = Object.freeze({
  id: 'hall id',
  name: 'example hall',
  layout: [],
});

const validDataVendor = {
  findHall: async () => [validHallData],
  saveEvent: async () => undefined,
} as unknown as CombinedStorageVendor;

let dataVendor: CombinedStorageVendor = Object.create(validDataVendor);

describe('Create Event Use Case test suite', () => {
  beforeEach(() => {
    dataVendor = Object.create(validDataVendor);
  });
  describe('When provided with invalid hallId', () => {
    it('Throws InvalidDataError', () => {
      dataVendor.findHall = async () => [];
      const useCase = new CreateEvent(dataVendor);

      const tryCreatingEvent = () => useCase.execute({
        eventName: 'example event',
        eventEndingDate: new Date('2020'),
        eventStartingDate: new Date('1999'),
        hallId: 'not hall id',
      });

      return expect(tryCreatingEvent())
        .to.eventually.be.rejected
        .and.to.be.an.instanceOf(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.ENTITY_NOT_FOUND);
    });
  });
  describe('When provided with valid hallId', () => {
    describe('and with invalid event data', () => {
      it('Throws InvalidDataError', () => {
        const useCase = new CreateEvent(dataVendor);

        const tryCreatingEvent = () => useCase.execute({
          eventName: 'example event',
          eventEndingDate: new Date('2020'),
          eventStartingDate: new Date('2036'),
          hallId: 'hall id',
        });
        return expect(tryCreatingEvent())
          .to.eventually.be.rejected
          .and.to.be.an.instanceOf(InvalidDataError)
          .with.property('subtype')
          .which.equals(InvalidDataErrorSubtype.INVALID_EVENT_DATA);
      });
    });
    describe('and with valid event data', () => {
      it('Returns info about newly created event matching to specified output type', async () => {
        const useCase = new CreateEvent(dataVendor);

        const output = await useCase.execute({
          eventName: 'example event',
          eventEndingDate: new Date('2020'),
          eventStartingDate: new Date('2019'),
          hallId: 'hall id',
        });

        expect(output).to.deep.include({
          eventName: 'example event',
        }).and.to.have.property('eventId');
      });
    });
  });
});
