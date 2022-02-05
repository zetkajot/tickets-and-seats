import { expect } from 'chai';
import Sinon from 'sinon';
import DomainError, { DomainErrorSubtype } from '../../../domain/errrors/domain-error';
import DiscrepancyError from '../errors/discrapency-error';
import tryReconstructing from './try-reconstructing';

describe('tryReconstructing helper test suite', () => {
  it('Invokes reconstructorFn with given reconstructorArgs', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const spiedReconstructorFn = Sinon.spy((someArg: boolean) => 'some output');

    tryReconstructing(spiedReconstructorFn, true);

    expect(spiedReconstructorFn).to.have.been.calledOnceWithExactly(true);
  });
  describe('When DomainError occurs during reconstruction', () => {
    it('Throws DiscrepancyError', () => {
      const throwingConstructorFn = () => {
        throw new DomainError(DomainErrorSubtype.BROKER_CLOSED_EVENT);
      };

      return expect(tryReconstructing.bind(this, throwingConstructorFn))
        .to.throw(DiscrepancyError);
    });
  });
  describe('When no error occurs', () => {
    it('Returns reconstructed entity', () => {
      const exampleReconstructorFn = () => 12345;

      const output = tryReconstructing(exampleReconstructorFn);

      expect(output).to.equal(12345);
    });
  });
});
