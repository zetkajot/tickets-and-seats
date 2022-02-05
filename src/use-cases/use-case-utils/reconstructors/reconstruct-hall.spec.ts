import { expect } from 'chai';
import { StoredHallData } from '../../../infrastracture/storage-vendors/hall-storage-vendor';
import reconstructHall from './reconstruct-hall';

describe('Hall reconstructor test suite', () => {
  const storedHall: StoredHallData = {
    id: 'example-id',
    name: 'example hall',
    layout: [
      [1, 0, 0],
      [3, 10, 0],
    ],
  };
  it('Sets Hall id and name to those passed in StoredHallData', () => {
    const hall = reconstructHall(storedHall);

    expect(hall).to.deep.include({
      id: 'example-id',
      name: 'example hall',
    });
  });
  it('All stored seats are present in reconstructed Hall', () => {
    const hall = reconstructHall(storedHall);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(hall.hasSeat(1)).to.be.true;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(hall.hasSeat(3)).to.be.true;
  });
});
