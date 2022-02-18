import { expect } from 'chai';
import flattenStructure from './flatten-structure';

const flatObj = {
  prop1: 'val1',
  prop2: true,
  prop3: 3,
};

const flattenedFlatObj = new Map<string, any>([
  [['prop1'].join('.'), 'val1'],
  [['prop2'].join('.'), true],
  [['prop3'].join('.'), 3],
]);

const oneLevelNestedObj = {
  prop1: 'val1',
  prop2: {
    prop1: false,
    prop2: 123,
  },
};

const flattenedOneLevelNestedObj = new Map<string, any>([
  [['prop1'].join('.'), 'val1'],
  [['prop2', 'prop1'].join('.'), false],
  [['prop2', 'prop2'].join('.'), 123],
]);

const twoLevelNestedObj = {
  prop1: 'val1',
  prop2: {
    prop1: {
      prop1: 'val2',
      prop2: false,
    },
    prop2: 123,
  },
  prop3: [1],
};

const flattenedTwoLevelNestedObj = new Map<string, any>([
  [['prop1'].join('.'), 'val1'],
  [['prop2', 'prop1', 'prop1'].join('.'), 'val2'],
  [['prop2', 'prop1', 'prop2'].join('.'), false],
  [['prop2', 'prop2'].join('.'), 123],
  [['prop3'].join('.'), [1]],
]);

const multipleLevelNestedObj = {
  prop1: {
    prop1: false,
    prop2: {
      prop1: {
        prop1: 'val1',
      },
      prop2: {
        prop1: true,
      },
    },
  },
  prop2: {
    prop1: [2],
  },
  prop3: -3,
};

const flattenedMultipleLevelNestedObj = new Map<string, any>([
  [['prop1', 'prop1'].join('.'), false],
  [['prop1', 'prop2', 'prop1', 'prop1'].join('.'), 'val1'],
  [['prop1', 'prop2', 'prop2', 'prop1'].join('.'), true],
  [['prop2', 'prop1'].join('.'), [2]],
  [['prop3'].join('.'), -3],
]);

describe('Flatten Structure fn test suite', () => {
  it('Should properly flatten flat objects', () => {
    const flatteningResult = flattenStructure(flatObj);
    expect(flatteningResult).to.deep.equal(flattenedFlatObj);
  });
  it('Should properly flatten object with 1 level of depth', () => {
    const flatteningResult = flattenStructure(oneLevelNestedObj);
    expect(flatteningResult).to.deep.equal(flattenedOneLevelNestedObj);
  });
  it('Should properly flatten object with 2 levels of depth', () => {
    const flatteningResult = flattenStructure(twoLevelNestedObj);
    expect(flatteningResult).to.deep.equal(flattenedTwoLevelNestedObj);
  });
  it('Should properly flatten object with multiple levels of depth', () => {
    const flatteningResult = flattenStructure(multipleLevelNestedObj);
    expect(flatteningResult).to.deep.equal(flattenedMultipleLevelNestedObj);
  });
});
