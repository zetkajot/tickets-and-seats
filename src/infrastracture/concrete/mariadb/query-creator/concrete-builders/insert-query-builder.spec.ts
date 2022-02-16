import { expect } from 'chai';
import InsertQueryBuilder from './insert-query-builder';

function setupDummyQuery(queryBuilder: InsertQueryBuilder) {
  queryBuilder.setTableName('DummyTable');
  queryBuilder.setField('field1', true);
  queryBuilder.setField('field2', -1);
  queryBuilder.setField('field3', '50m3/Cr4Z\\Y`/5tr1ng');
}
const queryBuilder = new InsertQueryBuilder();
setupDummyQuery(queryBuilder);
const builtQuery = queryBuilder.buildQuery();

function countOccurences(baseString: string, regexp: RegExp): number {
  let occurences = 0;
  // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unused-vars
  for (const match of baseString.matchAll(regexp)) occurences += 1;

  return occurences;
}

describe('INSERT Query Builder test suite', () => {
  describe('query', () => {
    it('query has valid structure', () => {
      expect(builtQuery.query).to.match(/INSERT INTO \? \(\?(, \?)*\) VALUES \(\?(, \?)*\) ON DUPLICATE KEY UPDATE \? = VALUES\(\?\)(, \? = VALUES\(\?\))*/g);
    });
    describe('When at least one field was set', () => {
      it('Each field name-value pair corresponds to 4 parameters in the query', () => {
        expect(countOccurences(builtQuery.query, /\?/g)).to.equal(13);
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
  });

  it('values\' first element is set table name', () => {
    expect(builtQuery.values[0]).to.equal('DummyTable');
  });

  it('values contains all set field names and values in correct order', () => {
    expect(builtQuery.values.slice(1)).to.deep.equal(
      [
        'field1', 'field2', 'field3',
        true, -1, '50m3/Cr4Z\\Y`/5tr1ng',
        'field1', 'field1',
        'field2', 'field2',
        'field3', 'field3',
      ],
    );
  });
});
