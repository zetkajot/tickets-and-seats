import { expect } from 'chai';
import Sinon from 'sinon';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import InvalidDataError from '../use-case-utils/errors/invalid-data-error';
import FindHallById from './find-hall-by-id';

describe('FindHallById Use Case test suite', () => {
  it('When no hall with given id existst throws InvalidDataError', () => {
    const dataVendor = {
      findHall: async () => [],
    };
    const findHallById = new FindHallById(dataVendor as unknown as CombinedStorageVendor);

    const tryFinding = () => findHallById.execute({ hallId: 'id of nonexistent event' });

    return expect(tryFinding())
      .to.eventually.be.rejected
      .and.to.be.an.instanceOf(InvalidDataError);
  });
  it('When succeedes, returns output data matching specified pattern', async () => {
    const findHallById = new FindHallById({
      findHall: Sinon.stub().returns([
        { id: 'example id', name: 'example name', layout: [[1, 0, 0], [2, 0, 0]] },
      ]),
    } as unknown as CombinedStorageVendor);

    expect(await findHallById.execute({ hallId: 'example id' })).to.deep.equal({
      hallId: 'example id',
      hallName: 'example name',
      seatLayout: [
        {
          seatNo: 1,
          seatPosition: {
            x: 0,
            y: 0,
          },
        },
        {
          seatNo: 2,
          seatPosition: {
            x: 0,
            y: 0,
          },
        },
      ],
    });
  });
});
