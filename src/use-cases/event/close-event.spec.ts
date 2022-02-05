import { expect } from 'chai';
import Sinon from 'sinon';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import InvalidDataError from '../use-case-utils/errors/invalid-data-error';
import CloseEvent from './close-event';

const closedEventData: StoredEventData = {
  id: 'event id',
  name: 'example event',
  hallId: 'hall id',
  startsAt: new Date('2020'),
  endsAt: new Date('2021'),
  isOpen: false,
  reservedSeats: [],
};

describe('Close Event Use Case test suite', () => {
  describe('When provided with id of nonexistent event', () => {
    it('Throws InvalidDataError', () => {
      const dataVendor = {
        findEvent: async () => [],
      } as unknown as CombinedStorageVendor;
      const useCase = new CloseEvent(dataVendor);

      const tryExecuting = () => useCase.execute({ eventId: 'nonexistent event id' });

      return expect(tryExecuting()).to.eventually.be.rejectedWith(InvalidDataError);
    });
  });
  describe('When provided with id of existing event', () => {
    describe('When event is open', () => {
      it('Saves event as closed to storage', async () => {
        const dataVendor = {
          findEvent: async () => [{ ...closedEventData, isOpen: true }],
          saveEvent: Sinon.spy(async () => undefined),
        } as unknown as CombinedStorageVendor;
        const useCase = new CloseEvent(dataVendor);

        await useCase.execute({ eventId: 'event id' });

        expect(dataVendor.saveEvent).to.have.been.calledWithMatch({
          isOpen: false,
        });
      });
      it('Returns event data matching specified output type', async () => {
        const dataVendor = {
          findEvent: async () => [{ ...closedEventData, isOpen: true }],
          saveEvent: async () => undefined,
        } as unknown as CombinedStorageVendor;
        const useCase = new CloseEvent(dataVendor);

        const output = await useCase.execute({ eventId: 'event id' });

        expect(output).to.deep.equal({
          eventId: 'event id',
          eventName: 'example event',
          isOpenForReservations: false,
        });
      });
    });
    describe('When event is closed', () => {
      it('Throws InvalidDataError', () => {
        const dataVendor = {
          findEvent: async () => [closedEventData],
        } as unknown as CombinedStorageVendor;
        const useCase = new CloseEvent(dataVendor);

        const tryExecuting = () => useCase.execute({ eventId: 'closed event id' });

        return expect(tryExecuting()).to.eventually.be.rejectedWith(InvalidDataError);
      });
    });
  });
});
