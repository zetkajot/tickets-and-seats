import { expect } from 'chai';
import Hall from '../../../domain/hall';
import SeatLayout from '../../../domain/seat-layout';
import makeStubHall from '../../../domain/testing/make-stub-hall';
import deconstructHall from './deconstruct-hall';

describe('Hall Deconstructor test sutie', () => {
  it('Hall\'s id and name are the same as those stored in StoredHallData', () => {
    const hall = makeStubHall();

    const storedHall = deconstructHall(hall);

    expect(storedHall).to.deep.include({
      id: hall.id,
      name: hall.name,
    });
  });
  it('Hall\'s seat layout is represented in StoredHallData', () => {
    const layout = new SeatLayout();
    layout.addSeat(10, [10, 30]);
    layout.addSeat(15, [13, 28]);
    const hall = new Hall('example-id', 'some name', layout);

    const storedHall = deconstructHall(hall);

    expect(storedHall.layout).to.deep.equal([
      [10, 10, 30],
      [15, 13, 28],
    ]);
  });
});
