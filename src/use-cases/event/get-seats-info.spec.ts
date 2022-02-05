import { expect } from 'chai';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import { StoredEventData } from '../../infrastracture/storage-vendors/event-storage-vendor';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import InvalidDataError from '../use-case-utils/errors/invalid-data-error';
import GetSeatsInfo from './get-seats-info';

const validEventData = {
  id: 'event id',
  endsAt: new Date('2024'),
  startsAt: new Date('2023'),
  name: 'example event',
  hallId: 'hall id',
  isOpen: false,
  reservedSeats: [1, 3, 5],
} as StoredEventData;

const validHallData = {
  id: 'hall id',
  name: 'example hall',
  layout: [
    [1, 0, 0],
    [2, 10, 0],
    [3, 20, 0],
    [4, 0, 10],
    [5, 0, 20],
  ],
} as StoredHallData;

describe('Get Seats Info Use Case test suite', () => {
  describe('When provided with nonexistent event it', () => {
    it('Throws InvalidDataError', () => {
      const dataVendor = {
        findEvent: async () => [],
      } as unknown as CombinedStorageVendor;
      const useCase = new GetSeatsInfo(dataVendor);

      expect(useCase.execute({ eventId: 'nonexistent event id' }))
        .to.eventually.be.rejectedWith(InvalidDataError);
    });
  });
  describe('When provided with id of existing event', () => {
    it('Returns data matching specified output pattern', async () => {
      const dataVendor = {
        findEvent: async () => [validEventData],
        findHall: async () => [validHallData],
      } as unknown as CombinedStorageVendor;
      const useCase = new GetSeatsInfo(dataVendor);

      const output = await useCase.execute({ eventId: 'event id' });

      expect(output).to.deep.equal({
        eventId: 'event id',
        hallId: 'hall id',
        reservedSeats: [
          {
            seatNo: 1,
            seatPosition: {
              x: 0,
              y: 0,
            },
          },
          {
            seatNo: 3,
            seatPosition: {
              x: 20,
              y: 0,
            },
          },
          {
            seatNo: 5,
            seatPosition: {
              x: 0,
              y: 20,
            },
          },
        ],
        freeSeats: [
          {
            seatNo: 2,
            seatPosition: {
              x: 10,
              y: 0,
            },
          },
          {
            seatNo: 4,
            seatPosition: {
              x: 0,
              y: 10,
            },
          },
        ],
      });
    });
  });
});
