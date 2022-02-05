import { expect } from 'chai';
import DomainError, { DomainErrorSubtype } from './errrors/domain-error';
import SeatLayout from './seat-layout';

describe('Seat Layout test suite', () => {
  it('Seats can be added', () => {
    const seatLayout = new SeatLayout();

    seatLayout.addSeat(1, [0, 0]);

    expect(seatLayout.layout).to.deep.include({
      seatNo: 1,
      position: [0, 0],
    });
  });
  it('Added seats can be removed', () => {
    const seatLayout = new SeatLayout();
    seatLayout.addSeat(1, [0, 0]);
    seatLayout.addSeat(2, [10, 20]);

    seatLayout.removeSeat(2);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(seatLayout.layout).to.deep.include({
      seatNo: 1,
      position: [0, 0],
    }).and.to.have.a.lengthOf(1);
  });
  it('Seats must have unique number id', () => {
    const seatLayout = new SeatLayout();
    seatLayout.addSeat(1, [0, 0]);

    const addSeatWithNonUniqueNumber = () => {
      seatLayout.addSeat(1, [12, 31]);
    };

    expect(addSeatWithNonUniqueNumber)
      .to.throw(DomainError)
      .with.property('subtype')
      .which.equals(DomainErrorSubtype.LAYOUT_NON_UNIQUE_NUMBERS);
  });
  it('Non-existent seats cannot be removed', () => {
    const seatLayout = new SeatLayout();

    const removeNonExistentSeat = () => {
      seatLayout.removeSeat(1);
    };

    expect(removeNonExistentSeat)
      .to.throw(DomainError)
      .with.property('subtype')
      .which.equals(DomainErrorSubtype.LAYOUT_UNKNOWN_SEAT);
  });
});
