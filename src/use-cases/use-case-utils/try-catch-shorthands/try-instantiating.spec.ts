/* eslint-disable max-classes-per-file */
import { expect } from 'chai';
import DomainError, { DomainErrorSubtype } from '../../../domain/errrors/domain-error';
import InvalidDataError, { InvalidDataErrorSubtype } from '../errors/invalid-data-error';
import tryInstantiating from './try-instantiating';

describe('tryInstantiating helper test suite', () => {
  describe('When DomainError occurs', () => {
    it('Throws InvalidDataError with set subtype', () => {
      const ThrowingClass = class {
        constructor() {
          throw new DomainError(DomainErrorSubtype.BROKER_CLOSED_EVENT);
        }
      };

      const tryTesting = () => tryInstantiating({
        possibleError: InvalidDataErrorSubtype.INVALID_EVENT_DATA,
      })(ThrowingClass);

      expect(tryTesting)
        .to.throw(InvalidDataError)
        .with.property('subtype')
        .which.equals(InvalidDataErrorSubtype.INVALID_EVENT_DATA);
    });
  });
  describe('When no error occurs', () => {
    it('Returns newly instantiated entity', () => {
      const NotThrowingClass = class {};

      expect(tryInstantiating()(NotThrowingClass)).to.be.an.instanceOf(NotThrowingClass);
    });
  });
});
