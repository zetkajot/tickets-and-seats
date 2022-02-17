import { expect } from 'chai';
import { StoredHallData } from '../../../storage-vendors/hall-storage-vendor';
import sanitizeHallData from './sanitize-hall-data';

describe('Hall Data Sanitizer test suite', () => {
  describe('When any of the properties has undefined value', () => {
    it('Should delete that property', () => {
      const dataWithUndefinedProperty = {
        layout: undefined,
      };
      const sanitizedData = sanitizeHallData(dataWithUndefinedProperty);

      expect(sanitizedData).to.not.have.property('layout');
    });
  });
  describe('When property layout is present', () => {
    it('Should stringify its value into JSON', () => {
      const dataWithLayout = {
        layout: [[1, 2, 3]],
      } as Partial<StoredHallData>;

      const sanitizedData = sanitizeHallData(dataWithLayout);

      expect(sanitizedData).to.have.property('layout', JSON.stringify([[1, 2, 3]]));
    });
  });
});
