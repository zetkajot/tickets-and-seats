import { expect } from 'chai';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import { StoredHallData } from '../../infrastracture/storage-vendors/hall-storage-vendor';
import FindHalls from './find-halls';

const dummyHallData = {
  id: 'some-hall-id',
  name: 'some hall',
  layout: [],
} as StoredHallData;

describe('Find Halls Use Case test suite', () => {
  describe('When no halls match given input data', () => {
    it('Returns an empty array', async () => {
      const sv = { findHall: async () => [] } as unknown as CombinedStorageVendor;
      const findHalls = new FindHalls(sv);

      const result = await findHalls.execute({ name: 'not matching' });

      expect(result).to.deep.equal([]);
    });
  });
  describe('When at least one hall match given input data', () => {
    it('Returns an array of hall-related data', async () => {
      const sv = {
        findHall: async () => [dummyHallData, dummyHallData],
      } as unknown as CombinedStorageVendor;
      const findHalls = new FindHalls(sv);

      const result = await findHalls.execute({ name: 'not matching' });

      expect(result).to.deep.equal([{
        hallId: 'some-hall-id',
        hallName: 'some hall',
      }, {
        hallId: 'some-hall-id',
        hallName: 'some hall',
      }]);
    });
  });
});
