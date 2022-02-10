import { expect } from 'chai';
import makeSaveQuery from './make-save-query';

describe('Save Query Factory test suite', () => {
  describe('When no parameters are given', () => {
    it('Throws error', () => {
      const tryCreatingQuery = () => makeSaveQuery('xd', {});

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(tryCreatingQuery).to.throw;
    });
  });
  describe('When at least one parameter is given', () => {
    it('Query inserts into given table', () => {
      const tableName = 'example_table';

      const query = makeSaveQuery(tableName, { x: 'x' });

      expect(query).to.include('INSERT INTO example_table');
    });
    it('Query ends with semicolon', () => {
      const query = makeSaveQuery('xs', { x: 'x' });

      expect(query[query.length - 1]).to.equal(';');
    });
    it('All parameters are present in query', () => {
      const params = {
        x: '1',
        y: '2',
        z: '3',
      };

      const query = makeSaveQuery('xd', params);

      expect(query).to.include('(x, y, z)');
    });
    it('All parameters values are present in query', () => {
      const params = {
        x: '1',
        y: '2',
        z: '3',
      };

      const query = makeSaveQuery('xd', params);

      expect(query).to.include('VALUES (\'1\', \'2\', \'3\')');
    });
    it('Non-string values are not single-quoted', () => {
      const params = {
        x: 1,
        y: '2',
        z: 2,
      };

      const query = makeSaveQuery('xd', params);

      expect(query).to.include('VALUES (1, \'2\', 2)');
    });
    it('Dates are converted to numbers (epoch time)', () => {
      const params = {
        x: new Date('2022'),
      };

      const query = makeSaveQuery('xd', params);

      expect(query).to.include(`VALUES (${new Date('2022').getTime()})`);
    });
    it('ON DUPLICATE KEY UPDATE clause is present', () => {
      const query = makeSaveQuery('xs', { x: 'x' });

      expect(query).to.include('ON DUPLICATE KEY UPDATE ');
    });
    it('All parameters except id are updated in case of duplicate key', () => {
      const params = {
        id: 1,
        y: '2',
        z: new Date('2022'),
      };

      const query = makeSaveQuery('xd', params);

      expect(query).to.include('y = VALUES(y), z = VALUES(z)');
    });
  });
});
