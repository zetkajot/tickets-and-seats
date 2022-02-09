import { expect } from 'chai';
import makeDeleteQuery from './make-delete-query';

describe('Delete Query Factory test suite', () => {
  it('Query deletes from given table', () => {
    const query = makeDeleteQuery('some_table', {});

    expect(query).to.include('DELETE FROM some_table');
  });
  it('Query ends with semicolon', () => {
    const query = makeDeleteQuery('some_table', {});

    expect(query[query.length - 1]).to.equal(';');
  });
  describe('When at least parameter was provided', () => {
    it('WHERE clause is present', () => {
      const query = makeDeleteQuery('some_table', { p1: 1 });

      expect(query).to.include('WHERE');
    });
    it('Every parameter is represented in query conditions', () => {
      const query = makeDeleteQuery('some_table', { p1: 1, p2: 3, p3: false });

      expect(query).to.include('p1 = 1 AND p2 = 3 AND p3 = false');
    });
    it('String values are single-quoted', () => {
      const query = makeDeleteQuery('some_table', { p1: 'some', p2: 'val' });

      expect(query).to.include('p1 = \'some\' AND p2 = \'val\'');
    });
  });
});
