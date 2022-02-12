/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from 'chai';
import DomainError, { DomainErrorSubtype } from '../../../domain/errrors/domain-error';
import DiscrepancyError from '../errors/discrapency-error';
import InvalidDataError, { InvalidDataErrorSubtype } from '../errors/invalid-data-error';
import tryEntityInteraction from './try-entity-interaction';

describe('tryEntityInteraction helper test suite', () => {
  describe('When DomainError occurs on interaction', () => {
    describe('When option \'onDomainError\' is set to \'InvalidDataError\'', () => {
      it('Throws InvalidDataError wit set subtype', () => {
        const throwingInteraction = (...args:any[]) => {
          throw new DomainError(DomainErrorSubtype.BROKER_UNKNOWN_SEAT);
        };

        const tryInteracting = () => tryEntityInteraction({
          onDomainError: 'InvalidDataError',
          errorSubtype: InvalidDataErrorSubtype.SEAT_NOT_FOUND,
        })(throwingInteraction, 'some', 'args');

        expect(tryInteracting)
          .to.throw(InvalidDataError)
          .with.property('subtype')
          .which.equals(InvalidDataErrorSubtype.SEAT_NOT_FOUND);
      });
    });
    describe('When option \'onDomainError\' is set to \'DiscrepancyError\'', () => {
      it('Throws DiscrepancyError', () => {
        const throwingInteraction = (...args:any[]) => {
          throw new DomainError(DomainErrorSubtype.BROKER_UNKNOWN_SEAT);
        };

        const tryInteracting = () => tryEntityInteraction({
          onDomainError: 'DiscrepancyError',
        })(throwingInteraction, 'some', 'args');

        expect(tryInteracting).to.throw(DiscrepancyError);
      });
    });
  });
  describe('When no error occurs on interaction', () => {
    it('Returns interaction result', () => {
      const returningInteraction = (...args:any[]) => args;

      const output = returningInteraction(1, 2, 3);

      expect(output).to.deep.equal([1, 2, 3]);
    });
  });
});
