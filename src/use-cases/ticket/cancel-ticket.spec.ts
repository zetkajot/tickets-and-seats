import { expect } from 'chai';
import Sinon from 'sinon';
import ErrorFactory from '../../error/error-factory';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import { StoredTicketData } from '../../infrastracture/storage-vendors/ticket-storage-vendor';
import deconstructEvent from '../use-case-utils/deconstructors/deconstruct-event';
import deconstructHall from '../use-case-utils/deconstructors/deconstruct-hall';
import makeDummyEvent from '../use-case-utils/dummies/make-dummy-event';
import makeDummyHall from '../use-case-utils/dummies/make-dummy-hall';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import CancelTicket from './cancel-ticket';

const dummyTicketData = {
  id: 'some-ticket',
  eventId: 'some-event',
  seatNo: 13,
} as StoredTicketData;

const dummyHall = makeDummyHall({
  id: 'some-hall',
  requiredSeats: [13],
});

const dummyEvent = makeDummyEvent({
  id: 'some-event',
  hall: dummyHall,
  reservedSeats: [13],
  isOpen: true,
});

describe('Cancel Ticket Use Case test suite', () => {
  before(() => {
    ErrorFactory.setDefaultLogger();
  });
  it('Looks for ticket with given id via storage vendor', async () => {
    const sv = {
      findTicket: Sinon.spy(async () => [dummyTicketData]),
      findEvent: async () => [deconstructEvent(dummyEvent)],
      findHall: async () => [deconstructHall(dummyHall)],
      deleteTicket: async () => {},
      saveEvent: async () => {},
    } as unknown as CombinedStorageVendor;
    const cancelTicket = new CancelTicket(sv);

    await cancelTicket.execute({ ticketId: 'some-ticket' });

    expect(sv.findTicket).to.have.been.calledOnceWithExactly({ id: 'some-ticket' });
  });
  describe('When no ticket match given id', () => {
    it('Throws InvalidDataError.ENTITY_NOT_FOUND', () => {
      const sv = {
        findTicket: async () => [],
      } as unknown as CombinedStorageVendor;
      const cancelTicket = new CancelTicket(sv);

      return expect(cancelTicket.execute({ ticketId: 'some-nonexistent-ticket' }))
        .to.eventually.be.rejectedWith(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.ENTITY_NOT_FOUND);
    });
  });
  describe('When ticket with given id was found', () => {
    it('Retrieves related event via storage vendor', async () => {
      const sv = {
        findTicket: async () => [dummyTicketData],
        findEvent: Sinon.spy(async () => [deconstructEvent(dummyEvent)]),
        findHall: async () => [deconstructHall(dummyHall)],
        deleteTicket: async () => {},
        saveEvent: async () => {},
      } as unknown as CombinedStorageVendor;
      const cancelTicket = new CancelTicket(sv);

      await cancelTicket.execute({ ticketId: 'some-ticket' });

      expect(sv.findEvent).to.have.been.calledOnceWithExactly({ id: 'some-event' });
    });
    describe('When event is closed for reservations', () => {
      it('Throws InvalidDataError.EVENT_CLOSED', () => {
        const sv = {
          findTicket: async () => [dummyTicketData],
          findEvent: Sinon.spy(async () => [{ ...deconstructEvent(dummyEvent), isOpen: false }]),
          findHall: async () => [deconstructHall(dummyHall)],
          deleteTicket: async () => {},
          saveEvent: async () => {},
        } as unknown as CombinedStorageVendor;
        const cancelTicket = new CancelTicket(sv);

        return expect(cancelTicket.execute({ ticketId: 'ticket-for-closed-event' }))
          .to.eventually.be.rejectedWith(InvalidDataError)
          .with.property('subtype')
          .which.equals(InvalidDataErrorSubtype.EVENT_CLOSED);
      });
    });
    describe('When event is open', () => {
      it('Deletes ticket via storage vendor', async () => {
        const sv = {
          findTicket: async () => [dummyTicketData],
          findEvent: async () => [deconstructEvent(dummyEvent)],
          findHall: async () => [deconstructHall(dummyHall)],
          deleteTicket: Sinon.spy(async () => {}),
          saveEvent: async () => {},
        } as unknown as CombinedStorageVendor;
        const cancelTicket = new CancelTicket(sv);

        await cancelTicket.execute({ ticketId: 'some-ticket' });

        expect(sv.deleteTicket).to.have.been.calledOnceWithExactly('some-ticket');
      });
      it('Saves modfied event(i.e. with unreserved seat)', async () => {
        const sv = {
          findTicket: async () => [dummyTicketData],
          findEvent: async () => [deconstructEvent(dummyEvent)],
          findHall: async () => [deconstructHall(dummyHall)],
          deleteTicket: async () => {},
          saveEvent: Sinon.spy(async () => {}),
        } as unknown as CombinedStorageVendor;
        const cancelTicket = new CancelTicket(sv);

        await cancelTicket.execute({ ticketId: 'some-ticket' });

        expect(sv.saveEvent).to.have.been.calledWithMatch({
          reservedSeats: [],
        });
      });
      it('Returns ticket-related info', async () => {
        const sv = {
          findTicket: async () => [dummyTicketData],
          findEvent: async () => [deconstructEvent(dummyEvent)],
          findHall: async () => [deconstructHall(dummyHall)],
          deleteTicket: async () => {},
          saveEvent: async () => {},
        } as unknown as CombinedStorageVendor;
        const cancelTicket = new CancelTicket(sv);

        const output = await cancelTicket.execute({ ticketId: 'some-ticket' });

        expect(output).to.deep.equal({
          ticketId: 'some-ticket',
          eventId: 'some-event',
          seatNo: 13,
        });
      });
    });
  });
});
