import { expect } from 'chai';
import ParserType from './parser-type';
import { exactValue } from './parser-utility-functions';
import { JSONParserSchema } from './types/json-parser-schema';
import SchemaStructureValidator from './schema-structure-validator';

const exampleJSONSchema: JSONParserSchema = {
  param1: ParserType.NUMBER,
  param2: exactValue(true),
};

const validSchema = {
  param1: 1234,
  param2: true,
};
const invalidSchema = {
  param1: true,
  param2: true,
};

describe('Schema Structure Validator test suite', () => {
  describe('When testing valid schema', () => {
    it('Should return true', () => {
      const validator = new SchemaStructureValidator(exampleJSONSchema);

      const validationResult = validator.isStructurallyValid(validSchema);

      expect(validationResult).to.equal(true);
    });
  });
  describe('When testing invalid schema', () => {
    it('Should return false', () => {
      const validator = new SchemaStructureValidator(exampleJSONSchema);

      const validationResult = validator.isStructurallyValid(invalidSchema);

      expect(validationResult).to.equal(false);
    });
  });
});
