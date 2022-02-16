import { expect } from 'chai';
import ConversionError, { ConversionErrorSubtype } from '../conversion-error';
import convertToNumber from './convert-to-number';

describe('Number Value Converter test suite', () => {
  describe('When provided with valid number string', () => {
    it('Returns a number', () => {
      const validNumberString = '19623';

      const number = convertToNumber(validNumberString);

      expect(number)
        .to.be.a('number')
        .and.to.equal(19623);
    });
  });
  describe('When provided with invalid number string', () => {
    it('Throws ConversionError.NOT_A_NUMBER', () => {
      const invalidNumberString = '/po192x-0219';

      const tryConvertingNumber = () => convertToNumber(invalidNumberString);

      expect(tryConvertingNumber)
        .to.throw(ConversionError)
        .with.property('subtype', ConversionErrorSubtype.NOT_A_NUMBER);
    });
  });
});
