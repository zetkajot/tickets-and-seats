import { expect } from 'chai';
import SelectQueryBuilder from './select-query-builder';
import countOccurences from '../../../../../utils/count-occurences';
import setupDummyQuery from './test-utils/setup-dummy-query';

const queryBuilder = new SelectQueryBuilder();
setupDummyQuery(queryBuilder);
const builtQuery = queryBuilder.buildQuery();

describe('SELECT Query Builder test suite', () => {
  describe('In resulting built query', () => {
    describe('query', () => {
      it('query has valid structure', () => {
        expect(builtQuery.query).to.match(/^SELECT \* FROM [a-zA-Z0-9-]+( WHERE [a-zA-Z0-9-]+=\?( AND [a-zA-Z0-9-]+=\?)*)?;$/);
      });
      describe('When at least one field was set', () => {
        it('there are as much parameters following WHERE clause as there were fields set', () => {
          expect(countOccurences(builtQuery.query, /[a-zA-Z0-9-]+=\?/g)).to.equal(3);
        });
      });
      describe('When no fields were set', () => {
        it('there is no WHERE clause and following it parameters', () => {
          const otherQueryBuilder = new SelectQueryBuilder();
          otherQueryBuilder.setTableName('someTable');
          const otherBuiltQuery = otherQueryBuilder.buildQuery();

          expect(otherBuiltQuery.query).to.equal('SELECT * FROM someTable;');
        });
      });
      it('table name is set', () => {
        expect(builtQuery.query).to.match(/^SELECT \* FROM DummyTable/);
      });
    });

    it('values contains all set field names and values in correct order', () => {
      expect(builtQuery.values).to.deep.equal(
        [true, -1, '50m3/Cr4Z\\Y`/5tr1ng'],
      );
    });
  });
});
