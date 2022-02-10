import { expect } from 'chai';
import { HallResultSet } from '../types/hall-result-set';
import resultSetToHallData from './result-set-to-hall-data';

const exampleHallResultSet: HallResultSet = [
  {
    id: 'example-hall-id-1',
    name: 'example hall name 1',
    layout: '[]',
  },
  {
    id: 'example-hall-id-2',
    name: 'example hall name 2',
    layout: '[[1, 0, 0]]',
  },
  [
    {
      collation: {},
      columnLength: 1,
      columnType: 'type',
      db: () => 'dbname',
      flags: 1234,
      name: () => 'name',
      orgName: () => 'org name',
      orgTable: () => 'org table',
      scale: 1,
      schema: () => 'dbname',
      table: () => 'table',
      type: 125,
    },
    {
      collation: {},
      columnLength: 1,
      columnType: 'type',
      db: () => 'dbname',
      flags: 1234,
      name: () => 'name',
      orgName: () => 'org name',
      orgTable: () => 'org table',
      scale: 1,
      schema: () => 'dbname',
      table: () => 'table',
      type: 125,
    },
  ],
];

describe('resultSetToHallData test suite', () => {
  describe('For every row non-meta row', () => {
    it('Converts layout to array', () => {
      const hallDataSet = resultSetToHallData(exampleHallResultSet);
      expect(hallDataSet[0].layout).to.deep.equal([]);
      expect(hallDataSet[1].layout).to.deep.equal([[1, 0, 0]]);
    });
    it('Does not change value of other fields', () => {
      const hallDataSet = resultSetToHallData(exampleHallResultSet);
      expect(hallDataSet[0].name).to.deep.equal('example hall name 1');
      expect(hallDataSet[1].name).to.deep.equal('example hall name 2');
      expect(hallDataSet[0].id).to.deep.equal('example-hall-id-1');
      expect(hallDataSet[1].id).to.deep.equal('example-hall-id-2');
    });
  });
});
