import { expect } from 'chai';
import Sinon from 'sinon';
import { StoredTicketData } from '../../infrastracture/storage-vendors/ticket-storage-vendor';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import ValidateTicket from './validate-ticket';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import makeDummyEvent from '../use-case-utils/dummies/make-dummy-event';
import makeDummyHall from '../use-case-utils/dummies/make-dummy-hall';
import deconstructEvent from '../use-case-utils/deconstructors/deconstruct-event';
import deconstructHall from '../use-case-utils/deconstructors/deconstruct-hall';

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
});

describe('Validate Ticket Use Case test suite', () => {
  it('Looks for ticket with given id via storage vendor', async () => {
    const sv = {
      findTicket: Sinon.spy(async () => [dummyTicketData]),
      findEvent: async () => [deconstructEvent(dummyEvent)],
      findHall: async () => [deconstructHall(dummyHall)],
    } as unknown as CombinedStorageVendor;
    const validateTicket = new ValidateTicket(sv);

    await validateTicket.execute({ ticketId: 'some-ticket' });

    expect(sv.findTicket).to.have.been.calledOnceWithExactly({ id: 'some-ticket' });
  });
  describe('When no ticket match given id', () => {
    it('Throws InvalidDataError.ENTITY_NOT_FOUND', () => {
      const sv = {
        findTicket: async () => [],
      } as unknown as CombinedStorageVendor;
      const validateTicket = new ValidateTicket(sv);

      return expect(validateTicket.execute({ ticketId: 'non-existent-ticket' }))
        .to.eventually.be.rejectedWith(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.ENTITY_NOT_FOUND);
    });
  });
  describe('When ticket matching given id was found', () => {
    it('Returns ticket-related information', async () => {
      const sv = {
        findTicket: async () => [dummyTicketData],
        findEvent: async () => [deconstructEvent(dummyEvent)],
        findHall: async () => [deconstructHall(dummyHall)],
      } as unknown as CombinedStorageVendor;
      const validateTicket = new ValidateTicket(sv);

      const result = await validateTicket.execute({ ticketId: 'some-ticket' });

      expect(result).to.deep.equal({
        ticketId: 'some-ticket',
        eventName: dummyEvent.name,
        hallName: dummyHall.name,
        startingDate: dummyEvent.startsAt,
        seatNo: 13,
      });
    });
  });
});
