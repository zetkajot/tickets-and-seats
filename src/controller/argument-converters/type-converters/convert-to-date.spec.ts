import { expect } from 'chai';
import ConversionError, { ConversionErrorSubtype } from '../conversion-error';
import convertToDate from './convert-to-date';

describe('Date Value Converter test suite', () => {
  describe('When provided with valid date string', () => {
    it('Returns a Date', () => {
      const validDateString = '2022';

      const date = convertToDate(validDateString);

      expect(date)
        .to.be.an.instanceOf(Date)
        .and.to.deep.equal(new Date('2022'));
    });
  });
  describe('When provided with invalid date string', () => {
    it('Throws ConversionError.NOT_A_DATE', () => {
      const invalidDateString = 'xdd-20202-83';

      const tryConvertingDate = () => convertToDate(invalidDateString);

      expect(tryConvertingDate)
        .to.throw(ConversionError)
        .with.property('subtype', ConversionErrorSubtype.NOT_A_DATE);
    });
  });
});
