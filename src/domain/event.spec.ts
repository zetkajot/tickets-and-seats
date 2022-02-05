/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import DomainError, { DomainErrorSubtype } from './errrors/domain-error';
import Event from './event';
import makeStubEvent from './testing/make-stub-event';
import makeStubHall from './testing/make-stub-hall';

describe('Event test suite', () => {
  describe('When creating new event', () => {
    it('Ending date must be later than starting date', () => {
      const startingDate = new Date('2022-01-10T12:30:00');
      const endingDate = new Date('2022-01-10T11:30:00');

      const createEventWithInvalidDates = () => {
        const invalidEvent = new Event(
          'id',
          'example event',
          startingDate,
          endingDate,
          makeStubHall(),
        );
      };

      expect(createEventWithInvalidDates)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_INVALID_DATE);
    });
    it('Is closed for reservations by default', () => {
      const event = makeStubEvent();

      const eventAcceptsReservations = event.isOpenForReservations;

      expect(eventAcceptsReservations).to.be.false;
    });
  });
  describe('When event is opened for reservations', () => {
    it('Unreserved seats can be reserved', () => {
      const openedEvent = makeStubEvent();
      openedEvent.openForReservations();

      openedEvent.reserveSeat(1);

      expect(openedEvent.reservedSeats).to.deep.include(1);
    });
    it('Reserved seats can be unreserved', () => {
      const openedEvent = makeStubEvent();
      openedEvent.openForReservations();
      openedEvent.reserveSeat(1);

      openedEvent.unreserveSeat(1);

      expect(openedEvent.reservedSeats).to.not.include(1);
    });
    it('Can be closed for reservations', () => {
      const openedEvent = makeStubEvent();
      openedEvent.openForReservations();

      openedEvent.closeForReservations();

      expect(openedEvent.isOpenForReservations).to.be.false;
    });
    it('Cannot be opened for reservations twice', () => {
      const openedEvent = makeStubEvent();
      openedEvent.openForReservations();

      const openEvent = () => {
        openedEvent.openForReservations();
      };

      expect(openEvent)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_OPENED_TWICE);
    });
    it('Cannot reserve nonexistent seat', () => {
      const openedEvent = makeStubEvent();
      openedEvent.openForReservations();

      const reserveSeat = () => {
        openedEvent.reserveSeat(10);
      };

      expect(reserveSeat)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_UNKNOWN_SEAT);
    });
    it('Cannot unreserve nonexistent seat', () => {
      const openedEvent = makeStubEvent();
      openedEvent.openForReservations();

      const unreserveSeat = () => {
        openedEvent.unreserveSeat(10);
      };

      expect(unreserveSeat)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_UNKNOWN_SEAT);
    });
    it('Cannot reserve already reserved seat', () => {
      const openedEvent = makeStubEvent();
      openedEvent.openForReservations();
      openedEvent.reserveSeat(1);

      const reserveSeat = () => {
        openedEvent.reserveSeat(1);
      };

      expect(reserveSeat)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_SEAT_RESERVED);
    });
    it('Cannot unreserve not reserved seat', () => {
      const openedEvent = makeStubEvent();
      openedEvent.openForReservations();

      const unreserveSeat = () => {
        openedEvent.unreserveSeat(1);
      };

      expect(unreserveSeat)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_SEAT_NOT_RESERVED);
    });
  });
  describe('When event is closed for reservations', () => {
    it('Cannot reserve any seats', () => {
      const closedEvent = makeStubEvent();

      const reserveSeat = () => {
        closedEvent.reserveSeat(10);
      };

      expect(reserveSeat)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_CLOSED);
    });
    it('Cannot unreserve any seats', () => {
      const closedEvent = makeStubEvent();

      const unreserveSeat = () => {
        closedEvent.unreserveSeat(10);
      };

      expect(unreserveSeat)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_CLOSED);
    });
    it('Can be opened for reservations', () => {
      const closedEvent = makeStubEvent();

      closedEvent.openForReservations();

      expect(closedEvent.isOpenForReservations).to.be.true;
    });
    it('Cannot be closed for reservations twice', () => {
      const closedEvent = makeStubEvent();

      const closeEvent = () => {
        closedEvent.closeForReservations();
      };

      expect(closeEvent)
        .to.throw(DomainError)
        .with.property('subtype')
        .which.equals(DomainErrorSubtype.EVENT_CLOSED_TWICE);
    });
  });
  it('Seat can be checked whether it is reserved or not', () => {
    const event = makeStubEvent();
    event.openForReservations();
    event.reserveSeat(1);

    expect(event.isReserved(1)).to.be.true;
    expect(event.isReserved(2)).to.be.false;
  });
  it('Nonexistent seats cannot be checked for their reservation state', () => {
    const event = makeStubEvent();

    const checkForStateOfNonexistentSeat = () => event.isReserved(99);

    expect(checkForStateOfNonexistentSeat)
      .to.throw(DomainError)
      .with.property('subtype')
      .which.equals(DomainErrorSubtype.EVENT_UNKNOWN_SEAT);
  });
});
