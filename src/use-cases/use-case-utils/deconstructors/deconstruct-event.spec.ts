import { expect } from 'chai';
import makeStubEvent from '../../../domain/testing/make-stub-event';
import deconstructEvent from './deconstruct-event';

describe('Event Deconstructor test suite', () => {
  it('All reserved seats are represented in StoredEventData', () => {
    const event = makeStubEvent();
    event.openForReservations();
    event.reserveSeat(1);

    const eventData = deconstructEvent(event);

    expect(eventData.reservedSeats).to.deep.equal(event.reservedSeats);
  });
  it('StoredEventData contains id of Event\'s Hall ', () => {
    const event = makeStubEvent();

    const eventData = deconstructEvent(event);

    expect(eventData.hallId).to.equal('example-hall-id');
  });
  it('Event\'s state is represented in StoredEventData', () => {
    const closedEvent = makeStubEvent();
    const openEvent = makeStubEvent();
    openEvent.openForReservations();

    const openEventData = deconstructEvent(openEvent);
    const closedEventData = deconstructEvent(closedEvent);

    expect(openEventData.isOpen).to.equal(true);
    expect(closedEventData.isOpen).to.equal(false);
  });
  it('Event\'s id, name, starting date and ending date are the same as those in StoredEvenData', () => {
    const event = makeStubEvent();

    const eventData = deconstructEvent(event);

    expect(eventData).to.deep.include({
      id: event.id,
      name: event.name,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
    });
  });
});
