import { expect } from 'chai';
import Sinon from 'sinon';
import StorageError from '../../../infrastracture/errors/storage-error';
import InternalError, { InternalErrorSubtype } from '../errors/internal-error';
import tryExecutingStorageQuery from './try-executing-storage-query';

describe('tryExecutingStorageQuery helper test suite', () => {
  it('Calls given queryFn with queryArgs', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const spiedQueryFn = Sinon.spy(async (someArg: string) => 12345);

    await tryExecutingStorageQuery(spiedQueryFn, 'example string');

    expect(spiedQueryFn).to.have.been.calledOnceWithExactly('example string');
  });
  describe('When StorageError occurs on queryFn call', () => {
    it('Returns InternalError with subtype for storage errors', () => {
      const throwingQueryFn = async () => { throw new StorageError(); };

      return expect(tryExecutingStorageQuery(throwingQueryFn))
        .to.eventually.be.rejected
        .and.to.be.an.instanceOf(InternalError)
        .with.property('subtype')
        .which.equals(InternalErrorSubtype.STORAGE_ERROR);
    });
  });
  describe('When error other than StorageError occurs on queryFn call', () => {
    it('Returns InternalError with subtype for unknown errors', () => {
      const throwingQueryFn = async () => { throw new Error(); };

      return expect(tryExecutingStorageQuery(throwingQueryFn))
        .to.eventually.be.rejected
        .and.to.be.an.instanceOf(InternalError)
        .with.property('subtype')
        .which.equals(InternalErrorSubtype.UNKNOWN_ERROR);
    });
  });
  describe('When call to queryFn succeeds', () => {
    it('Returns data returned by queryFn', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const queryFn = async (someArg: string) => 12345;

      const output = await tryExecutingStorageQuery(queryFn, 'some');

      expect(output).to.equal(12345);
    });
  });
});
