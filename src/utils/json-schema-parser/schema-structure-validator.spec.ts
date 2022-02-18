import { expect } from 'chai';
import ParserType from './parser-type';
import { array, exactValue } from './parser-utility-functions';
import { JSONParserSchema } from './types/json-parser-schema';
import SchemaStructureValidator from './schema-structure-validator';

const exampleSimpleJSONSchema: JSONParserSchema = {
  param1: ParserType.NUMBER,
  param2: exactValue(true),
};

const validSimpleSchema = {
  param1: 1234,
  param2: true,
};
const invalidSimpleSchema = {
  param1: true,
  param2: true,
};

const exampleNestedJSONSchema: JSONParserSchema = {
  param1: ParserType.STRING,
  param2: array({
    nestedParam1: ParserType.NUMBER,
  }),
};

const validNestedSchema = {
  param1: 'some string',
  param2: [
    { nestedParam1: 1 },
    { nestedParam1: 2 },
    { nestedParam1: 3 },
  ],
};
const invalidNestedSchema = {
  param1: 'some string',
  param2: [
    { nestedParam1: 1 },
    { nestedParam1: 2 },
    { nestedParam1: 'three' },
  ],
};

describe('Schema Structure Validator test suite', () => {
  it('Should recognize simple valid schemas', () => {
    const validator = new SchemaStructureValidator(exampleSimpleJSONSchema);

    const validationResult = validator.isStructurallyValid(validSimpleSchema);

    expect(validationResult).to.equal(true);
  });
  it('Should recognize simple invalid schemas', () => {
    const validator = new SchemaStructureValidator(exampleSimpleJSONSchema);

    const validationResult = validator.isStructurallyValid(invalidSimpleSchema);

    expect(validationResult).to.equal(false);
  });
  it('Should recognize nested invalid schemas', () => {
    const validator = new SchemaStructureValidator(exampleNestedJSONSchema);

    const validationResult = validator.isStructurallyValid(invalidNestedSchema);

    expect(validationResult).to.equal(false);
  });
  it('Should recognize nested valid schemas', () => {
    const validator = new SchemaStructureValidator(exampleNestedJSONSchema);

    const validationResult = validator.isStructurallyValid(validNestedSchema);

    expect(validationResult).to.equal(true);
  });
});
