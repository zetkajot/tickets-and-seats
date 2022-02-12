import { expect } from 'chai';
import Sinon from 'sinon';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import OpenEvent from './open-event';

const closedEventData: StoredEventData = {
  id: 'event id',
  name: 'example event',
  hallId: 'hall id',
  startsAt: new Date('2020'),
  endsAt: new Date('2021'),
  isOpen: false,
  reservedSeats: [],
};

const validHallData: StoredHallData = {
  id: 'hall id',
  layout: [],
  name: 'example hall',
};

describe('Open Event Use Case test suite', () => {
  describe('When provided with id of nonexistent event', () => {
    it('Throws InvalidDAtaError', () => {
      const dataVendor = {
        findEvent: async () => [],
        findHall: async () => [validHallData],
      } as unknown as CombinedStorageVendor;
      const useCase = new OpenEvent(dataVendor);

      return expect(useCase.execute({ eventId: 'nonexistent event id' }))
        .to.eventually.be.rejectedWith(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.ENTITY_NOT_FOUND);
    });
  });
  describe('When provided with id of existing event', () => {
    describe('When event is open for reservations', () => {
      it('Throws InvalidDataError', () => {
        const dataVendor = {
          findEvent: async () => [{ ...closedEventData, isOpen: true } as StoredEventData],
          findHall: async () => [validHallData],
        } as unknown as CombinedStorageVendor;
        const useCase = new OpenEvent(dataVendor);

        return expect(useCase.execute({ eventId: 'nonexistent event id' }))
          .to.eventually.be.rejectedWith(InvalidDataError)
          .with.property('subtype')
          .which.equals(InvalidDataErrorSubtype.EVENT_CLOSED);
      });
    });
    describe('When event is closed for reservations', () => {
      it('Saves event as closed in storage', async () => {
        const dataVendor = {
          findEvent: async () => [closedEventData],
          findHall: async () => [validHallData],
          saveEvent: Sinon.spy(async () => undefined),
        } as unknown as CombinedStorageVendor;
        const useCase = new OpenEvent(dataVendor);

        await useCase.execute({ eventId: 'event id' });

        expect(dataVendor.saveEvent).to.have.been.calledWithMatch({
          isOpen: true,
        });
      });
      it('Returns event data matching specified output type', async () => {
        const dataVendor = {
          findEvent: async () => [closedEventData],
          findHall: async () => [validHallData],
          saveEvent: async () => undefined,
        } as unknown as CombinedStorageVendor;
        const useCase = new OpenEvent(dataVendor);

        const output = await useCase.execute({ eventId: 'event id' });

        expect(output).to.deep.equal({
          eventId: 'event id',
          eventName: 'example event',
          isOpenForReservations: true,
        });
      });
    });
  });
});
