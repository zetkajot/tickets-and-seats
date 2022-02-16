import { expect } from 'chai';
import Sinon, { SinonSpy } from 'sinon';
import QueryCreationDirector from './query-creation-director';
import QueryBuilder from './types/query-builder';

const dummyQueryBuilder: QueryBuilder = {
  buildQuery: Sinon.spy(() => ({ query: 'some-query', values: [] })),
  setField: Sinon.spy(),
  setTableName: Sinon.spy(),
};

const director = new QueryCreationDirector(dummyQueryBuilder);

describe('Query Creation Director test suite', () => {
  describe('on createQuery', () => {
    before(() => {
      director.createQuery('some-table', { field1: true, field2: 'false', field3: -1 });
    });
    it('Calls setTableName method on used QueryBuilder with given table name', () => {
      expect(dummyQueryBuilder.setTableName)
        .to.have.been.calledOnceWithExactly('some-table');
    });
    describe('For reach name-value pair given in fields param', () => {
      it('Calls setField mthod on used QueryBuilder with those values', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(dummyQueryBuilder.setField).to.have.been.calledThrice;
        expect((dummyQueryBuilder.setField as SinonSpy).firstCall.args).to.deep.equal(['field1', true]);
        expect((dummyQueryBuilder.setField as SinonSpy).secondCall.args).to.deep.equal(['field2', 'false']);
        expect((dummyQueryBuilder.setField as SinonSpy).thirdCall.args).to.deep.equal(['field3', -1]);
      });
    });
    it('Calls buildQuery method on QueryBuilder', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(dummyQueryBuilder.buildQuery).to.have.been.calledOnce;
    });
  });
});
