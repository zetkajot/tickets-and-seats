/* eslint-disable max-classes-per-file */
import { expect } from 'chai';
import DomainError, { DomainErrorSubtype } from '../../../domain/errrors/domain-error';
import InvalidDataError from '../errors/invalid-data-error';
import tryInstantiating from './try-instantiating';

describe('tryInstantiating helper test suite', () => {
  describe('When DomainError occurs', () => {
    it('Throws InvalidDataError', () => {
      const ThrowingClass = class {
        constructor() {
          throw new DomainError(DomainErrorSubtype.BROKER_CLOSED_EVENT);
        }
      };

      const tryTesting = () => tryInstantiating(ThrowingClass);

      expect(tryTesting).to.throw(InvalidDataError);
    });
  });
  describe('When no error occurs', () => {
    it('Returns newly instantiated entity', () => {
      const NotThrowingClass = class {};

      expect(tryInstantiating(NotThrowingClass)).to.be.an.instanceOf(NotThrowingClass);
    });
  });
});
