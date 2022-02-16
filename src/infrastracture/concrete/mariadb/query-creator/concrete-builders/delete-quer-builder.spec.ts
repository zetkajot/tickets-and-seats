import { expect } from 'chai';
import DeleteQueryBuilder from './delete-query-builder';

function setupDummyQuery(queryBuilder: DeleteQueryBuilder) {
  queryBuilder.setTableName('DummyTable');
  queryBuilder.setField('field1', true);
  queryBuilder.setField('field2', -1);
  queryBuilder.setField('field3', '50m3/Cr4Z\\Y`/5tr1ng');
}
const queryBuilder = new DeleteQueryBuilder();
setupDummyQuery(queryBuilder);
const builtQuery = queryBuilder.buildQuery();

function countOccurences(baseString: string, regexp: RegExp): number {
  let occurences = 0;
  // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unused-vars
  for (const match of baseString.matchAll(regexp)) occurences += 1;

  return occurences;
}

describe('DELETE Query Builder test suite', () => {
  describe('In resulting built query', () => {
    describe('query', () => {
      it('query has valid structure', () => {
        expect(builtQuery.query).to.match(/^DELETE FROM \?( WHERE \?=\?( AND \?=\?)*)?;$/);
      });
      describe('When at least one field was set', () => {
        it('there are as much parameters following WHERE clause as there were fields set', () => {
          expect(countOccurences(builtQuery.query, /\?=\?/g)).to.equal(3);
        });
      });
      describe('When no fields were set', () => {
        it('there is no WHERE clause and following it parameters', () => {
          const otherQueryBuilder = new DeleteQueryBuilder();
          otherQueryBuilder.setTableName('some-table');
          const otherBuiltQuery = otherQueryBuilder.buildQuery();

          expect(otherBuiltQuery.query).to.equal('DELETE FROM ?;');
        });
      });
    });

    it('values\' first element is set table name', () => {
      expect(builtQuery.values[0]).to.equal('DummyTable');
    });

    it('values contains all set field names and values in correct order', () => {
      expect(builtQuery.values.slice(1)).to.deep.equal(
        ['field1', true, 'field2', -1, 'field3', '50m3/Cr4Z\\Y`/5tr1ng'],
      );
    });
  });
});
