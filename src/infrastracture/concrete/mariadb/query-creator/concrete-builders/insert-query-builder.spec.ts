import { expect } from 'chai';
import countOccurences from '../../../../../utils/count-occurences';
import InsertQueryBuilder from './insert-query-builder';
import setupDummyQuery from './test-utils/setup-dummy-query';

const queryBuilder = new InsertQueryBuilder();
setupDummyQuery(queryBuilder);
const builtQuery = queryBuilder.buildQuery();

describe('INSERT Query Builder test suite', () => {
  describe('query', () => {
    it('query has valid structure', () => {
      expect(builtQuery.query).to.match(/INSERT INTO [a-zA-Z0-9-]+ \([a-zA-Z0-9-]+(, [a-zA-Z0-9-]+)*\) VALUES \(\?(, \?)*\) ON DUPLICATE KEY UPDATE [a-zA-Z0-9-]+ = VALUES\([a-zA-Z0-9-]+\)(, [a-zA-Z0-9-]+ = VALUES\([a-zA-Z0-9-]+\))*/g);
    });
    describe('When at least one field was set', () => {
      it('Each field corresponds to 1 parameters in the query', () => {
        expect(countOccurences(builtQuery.query, /\?/g)).to.equal(3);
      });
    });
    describe('When no fields were set', () => {
      it('throws an error', () => {
        const otherQueryBuilder = new InsertQueryBuilder();
        otherQueryBuilder.setTableName('sum-table');
        expect(otherQueryBuilder.buildQuery.bind(otherQueryBuilder))
          .to.throw('INSERT query requires at least one field set!');
      });
    });
    it('table name is set', () => {
      expect(builtQuery.query).to.match(/^INSERT INTO DummyTable/g);
    });
  });

  it('values contains all set field names and values in correct order', () => {
    expect(builtQuery.values).to.deep.equal(
      [
        true, -1, '50m3/Cr4Z\\Y`/5tr1ng',
      ],
    );
  });
});
