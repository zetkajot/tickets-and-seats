import { expect } from 'chai';
import makeStubHall from '../../../domain/testing/make-stub-hall';
import { StoredEventData } from '../../../infrastracture/storage-vendors/event-storage-vendor';
import reconstructEvent from './reconstruct-event';

describe('Event reconstructor test suite', () => {
  const storedEvent: StoredEventData = {
    id: 'example-id',
    name: 'example name',
    startsAt: new Date('2022-01-01'),
    endsAt: new Date('2022-02-02'),
    hallId: 'example-hall-id',
    isOpen: true,
    reservedSeats: [1, 2],
  };
  const hall = makeStubHall();

  it('Sets Event\'s id, name, starting date and ending date to those passed in StoredEventData', () => {
    const event = reconstructEvent(storedEvent, hall);

    expect(event).to.deep.include({
      id: 'example-id',
      name: 'example name',
      startsAt: new Date('2022-01-01'),
      endsAt: new Date('2022-02-02'),
    });
  });
  it('Returned Event is already opened when StoredEventData says so', () => {
    const event = reconstructEvent(storedEvent, hall);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(event.isOpenForReservations).to.be.true;
  });
  it('All reserved seats numbers stored in StoredEventData are present in returned Event', () => {
    const event = reconstructEvent(storedEvent, hall);

    expect(event.reservedSeats).to.deep.equal([1, 2]);
  });
});
