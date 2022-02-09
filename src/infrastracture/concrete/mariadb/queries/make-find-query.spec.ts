import { expect } from 'chai';
import makeFindQuery from './make-find-query';

describe('Find Query factory test suite', () => {
  it('Query selects everything from correct table', () => {
    const tableName = 'example_table';

    const query = makeFindQuery(tableName, {});

    expect(query).to.include('SELECT * FROM example_table');
  });
  it('Query ends with semicolon', () => {
    const query = makeFindQuery('some_table', {});

    expect(query[query.length - 1]).to.equal(';');
  });
  describe('When all parameters are undefined', () => {
    it('Query has no WHERE clause', () => {
      const query = makeFindQuery('some_table', {});

      expect(query).to.not.include('WHERE');
    });
  });
  describe('When at least one parameter is defined', () => {
    it('Query has WHERE clause', () => {
      const query = makeFindQuery('some_table', { param1: 'value', param2: 'value' });

      expect(query).to.include('WHERE');
    });
    it('All defined parameters conditions are present after WHERE clause', () => {
      const query = makeFindQuery('some_table', { param1: 'value', param2: 'value' });

      expect(query)
        .to.include('param1 = \'value\'')
        .and.to.include('param2 = \'value\'');
    });
    it('Multiple conditions are separated by AND', () => {
      const query = makeFindQuery('some_table', { param1: 'value', param2: 'value' });

      expect(query).to.include('WHERE param1 = \'value\' AND param2 = \'value\';');
    });
  });
});
