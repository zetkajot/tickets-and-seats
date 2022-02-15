import { expect } from 'chai';
import ConversionError, { ConversionErrorSubtype } from '../conversion-error';
import convertToObject from './convert-to-object';

describe('Object Value Converter test suite', () => {
  describe('When provided with valid JSON string', () => {
    it('Returns an object', () => {
      const validJSON = '{"prop": "val"}';

      const object = convertToObject(validJSON);

      expect(object)
        .to.be.an('object')
        .and.to.deep.equal({ prop: 'val' });
    });
  });
  describe('When provided with invalid JSON string', () => {
    it('Throws ConversionError.NOT_AN_OBJECT', () => {
      const invalidJSON = '{2+3+5}';

      const tryConvertingObject = () => convertToObject(invalidJSON);

      expect(tryConvertingObject)
        .to.throw(ConversionError)
        .with.property('subtype', ConversionErrorSubtype.NOT_AN_OBJECT);
    });
  });
});
