import { expect } from 'chai';
import { Pool } from 'mariadb';
import Sinon, { SinonSpy } from 'sinon';
import ExecutorTemplate from './executor-template';
import { QueryCreators } from './query-creators';

const fakeTableName = 'SomeTable';
const spiedSelectPool = { query: Sinon.spy(async () => ({ result: '1' })) } as unknown as Pool;
const spiedAffectingPool = {
  query: Sinon.spy(async () => ({ affectedRows: 1 })),
} as unknown as Pool;
const spiedNonAffectingPool = {
  query: Sinon.spy(async () => ({ affectedRows: 0 })),
} as unknown as Pool;
const spiedQueryCreators = {
  selectQueryCreator: { createQuery: Sinon.spy(() => ({ query: 'SELECT', values: [1] })) },
  deleteQueryCreator: { createQuery: Sinon.spy(() => ({ query: 'DELETE', values: [1] })) },
  insertQueryCreator: { createQuery: Sinon.spy(() => ({ query: 'INSERT', values: [1] })) },
} as unknown as QueryCreators;
const spiedDataSanitizer = Sinon.spy(() => ({ sanitized: true }));
const spiedQueryResultConverter = Sinon.spy(() => ({ converted: true }));

describe('Executor Template test suite', () => {
  let spiedExecutorTemplate: ExecutorTemplate<any, any, any>;
  describe('When executing select query', () => {
    before(async () => {
      Sinon.reset();
      spiedExecutorTemplate = new ExecutorTemplate(
        fakeTableName,
        spiedSelectPool,
        spiedQueryCreators,
        spiedDataSanitizer,
        spiedQueryResultConverter,
      );
      await spiedExecutorTemplate.executeSelectQuery({ fake: true });
    });
    it('Should sanitize given data first', () => {
      expect(spiedDataSanitizer).to.have.been.calledOnceWithExactly({ fake: true });
    });
    it('Should build a query using sanitized data second', () => {
      expect(spiedQueryCreators.selectQueryCreator.createQuery)
        .to.have.been.calledOnceWithExactly(fakeTableName, { sanitized: true })
        .and.to.have.been.calledImmediatelyAfter(spiedDataSanitizer);
    });
    it('Should execute built query as a third step', () => {
      expect(spiedSelectPool.query)
        .to.have.been.calledOnceWithExactly('SELECT', [1])
        .and.to.have.been.called.calledImmediatelyAfter(
          spiedQueryCreators.selectQueryCreator.createQuery as SinonSpy,
        );
    });
    it('Should convert query result for the last step', () => {
      expect(spiedQueryResultConverter)
        .to.have.been.calledOnceWithExactly({ result: '1' })
        .and.to.have.been.called.calledImmediatelyAfter(spiedSelectPool.query as SinonSpy);
    });
  });
  describe('When executing insert query', () => {
    before(async () => {
      Sinon.reset();
      spiedExecutorTemplate = new ExecutorTemplate(
        fakeTableName,
        spiedAffectingPool,
        spiedQueryCreators,
        spiedDataSanitizer,
        spiedQueryResultConverter,
      );
      await spiedExecutorTemplate.executeInsertQuery({ fake: true });
    });
    it('Should sanitize given data first', () => {
      expect(spiedDataSanitizer).to.have.been.calledOnceWithExactly({ fake: true });
    });
    it('Should build a query using sanitized data second', () => {
      expect(spiedQueryCreators.insertQueryCreator.createQuery)
        .to.have.been.calledOnceWithExactly(fakeTableName, { sanitized: true })
        .and.to.have.been.calledImmediatelyAfter(spiedDataSanitizer);
    });
    it('Should execute built query as a third step', () => {
      expect(spiedAffectingPool.query)
        .to.have.been.calledOnceWithExactly('INSERT', [1])
        .and.to.have.been.called.calledImmediatelyAfter(
          spiedQueryCreators.insertQueryCreator.createQuery as SinonSpy,
        );
    });
    describe('When at least one row was affected by query', () => {
      it('Should not throw', () => expect(spiedExecutorTemplate.executeInsertQuery({ fake: true }))
        .to.eventually.be.fulfilled);
    });
    describe('When no rows were affected by query', () => {
      before(async () => {
        Sinon.reset();
        spiedExecutorTemplate = new ExecutorTemplate(
          fakeTableName,
          spiedNonAffectingPool,
          spiedQueryCreators,
          spiedDataSanitizer,
          spiedQueryResultConverter,
        );
      });
      it('Should throw an error', () => expect(spiedExecutorTemplate.executeInsertQuery({ fake: true }))
        .to.eventually.be.rejected);
    });
  });
  describe('When executing delete query', () => {
    before(async () => {
      Sinon.reset();
      spiedExecutorTemplate = new ExecutorTemplate(
        fakeTableName,
        spiedAffectingPool,
        spiedQueryCreators,
        spiedDataSanitizer,
        spiedQueryResultConverter,
      );
      await spiedExecutorTemplate.executeDeleteQuery({ fake: true });
    });
    it('Should sanitize given data first', () => {
      expect(spiedDataSanitizer).to.have.been.calledOnceWithExactly({ fake: true });
    });
    it('Should build a query using sanitized data second', () => {
      expect(spiedQueryCreators.deleteQueryCreator.createQuery)
        .to.have.been.calledOnceWithExactly(fakeTableName, { sanitized: true })
        .and.to.have.been.calledImmediatelyAfter(spiedDataSanitizer);
    });
    it('Should execute built query as a third step', () => {
      expect(spiedAffectingPool.query)
        .to.have.been.calledOnceWithExactly('DELETE', [1])
        .and.to.have.been.called.calledImmediatelyAfter(
          spiedQueryCreators.deleteQueryCreator.createQuery as SinonSpy,
        );
    });
    describe('When at least one row was affected by query', () => {
      it('Should not throw', () => expect(spiedExecutorTemplate.executeDeleteQuery({ fake: true }))
        .to.eventually.be.fulfilled);
    });
    describe('When no rows were affected by query', () => {
      before(async () => {
        Sinon.reset();
        spiedExecutorTemplate = new ExecutorTemplate(
          fakeTableName,
          spiedNonAffectingPool,
          spiedQueryCreators,
          spiedDataSanitizer,
          spiedQueryResultConverter,
        );
      });
      it('Should throw an error', () => expect(spiedExecutorTemplate.executeDeleteQuery({ fake: true }))
        .to.eventually.be.rejected);
    });
  });
});
