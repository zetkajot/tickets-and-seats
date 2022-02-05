/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import Hall from './hall';
import SeatLayout from './seat-layout';

describe('Hall test suite', () => {
  it('Can be checked if seat with given number exists in this Hall', () => {
    const layout = new SeatLayout();
    layout.addSeat(10, [0, 0]);
    const hall = new Hall('id', 'example', layout);

    const hasExistingSeat = hall.hasSeat(10);
    const hasNonExistingSeat = hall.hasSeat(20);

    expect(hasExistingSeat).to.be.true;
    expect(hasNonExistingSeat).to.be.false;
  });
});
