import { expect } from 'chai';
import Sinon from 'sinon';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import InvalidDataError, { InvalidDataErrorSubtype } from '../use-case-utils/errors/invalid-data-error';
import CreateHall from './create-hall';

const validLayout = [
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
      x: 10,
      y: 10,
    },
  },
];

const invalidLayout = [
  {
    seatNo: 1,
    seatPosition: {
      x: 0,
      y: 0,
    },
  },
  {
    seatNo: 1,
    seatPosition: {
      x: 10,
      y: 10,
    },
  },
];

describe('Create Hall Use Case test suite', () => {
  describe('When provided with invalid layout', () => {
    it('Throws InvalidDataError', async () => {
      const useCase = new CreateHall({} as CombinedStorageVendor);

      return expect(useCase.execute({ hallName: 'hall x', seatLayout: invalidLayout }))
        .to.eventually.be.rejectedWith(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.INVALID_SEAT_LAYOUT);
    });
  });
  describe('When provided with valid hall data', () => {
    it('Saves new hall in storage', async () => {
      const dataVendor = {
        saveHall: Sinon.spy(async () => undefined),
      } as unknown as CombinedStorageVendor;
      const useCase = new CreateHall(dataVendor);

      await useCase.execute({ hallName: 'example hall', seatLayout: validLayout });

      expect(dataVendor.saveHall).to.have.been.calledWithMatch({
        name: 'example hall',
        layout: [
          [1, 0, 0],
          [2, 10, 10],
        ],
      });
    });
    it('Returns hall data matching specified output pattern', async () => {
      const dataVendor = {
        saveHall: async () => undefined,
      } as unknown as CombinedStorageVendor;
      const useCase = new CreateHall(dataVendor);

      const output = await useCase.execute({ hallName: 'example hall', seatLayout: validLayout });

      expect(output).to.include({
        hallName: 'example hall',
        seatLayout: validLayout,
      }).and.to.have.property('hallId');
    });
  });
});
