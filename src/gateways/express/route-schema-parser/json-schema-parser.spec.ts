import { expect } from 'chai';
import JSONSchemaParser from './json-schema-parser';
import ParserError from './errors/parser-error';
import { JSONParserSchema } from './types/json-parser-schema';
import { exactValue, inValues } from './parser-utility-functions';
import ParserType from './parser-type';

const exampleSchema: JSONParserSchema = {
  key1: ParserType.STRING,
  key2: inValues(['allowed-value1', 'allowed-value2']),
  key3: {
    'sub-key1': exactValue(true),
    'sub-key2': ParserType.NUMBER,
  },
};

const exampleInvalidJSON = '{some-val: 1,}';
const exampleInvalidStructure = JSON.stringify({
  key1: 'some string',
  key2: 'not-allowe-value',
  key3: {
    'sub-key1': true,
    'sub-key2': 2109,
  },
});
const exampleValidStructure = JSON.stringify({
  key1: 'some other string',
  key2: 'allowed-value2',
  key3: {
    'sub-key1': true,
    'sub-key2': 123,
  },
});

describe('JSON Schema Parser test suite', () => {
  describe('When parsing', () => {
    describe('When provided string is not a valid JSON', () => {
      it('Should throw an error', () => {
        const parser = new JSONSchemaParser(exampleSchema);

        const tryParsing = () => parser.parse(exampleInvalidJSON);

        expect(tryParsing).to.throw(ParserError);
      });
    });
    describe('Whem provided JSON\'s structure does not match the schema', () => {
      it('Should throw an error', () => {
        const parser = new JSONSchemaParser(exampleSchema);

        const tryParsing = () => parser.parse(exampleInvalidStructure);

        expect(tryParsing).to.throw(ParserError);
      });
    });
    describe('When key or values have no custom behaviour set', () => {
      it('Should not change it', () => {
        const parser = new JSONSchemaParser(exampleSchema);

        const parsedObject = parser.parse(exampleValidStructure);

        expect(parsedObject).to.have.property('key1', 'some other string');
      });
    });
    describe('When key has custom behaviour set', () => {
      it('Should change it and its value using specified behaviour', () => {
        const parser = new JSONSchemaParser(exampleSchema);

        parser.forKey('sub-key1', () => ['newKey', false]);
        const parsedObject = parser.parse(exampleValidStructure);

        expect(parsedObject).to.have.nested.property('key3.newKey', false);
      });
    });
    describe('When value has custom behaviour set', () => {
      it('Should change it and its key using specified behaviour', () => {
        const parser = new JSONSchemaParser(exampleSchema);

        parser.forValue((value: any) => typeof value === 'number', (name, value) => ['i am a number', value]);
        const parsedObject = parser.parse(exampleValidStructure);

        expect(parsedObject).to.have.nested.property('key3.i am a number', 123);
      });
    });
    describe('When both key and value have custom behaviours set', () => {
      it('Should change it and its value using behaviour specified for key first, and then using behaviour specified for value', () => {
        const parser = new JSONSchemaParser(exampleSchema);

        parser.forValue('allowed-value2', () => ['by-value', false]);
        parser.forKey('key2', () => ['by-key', true]);
        const parsedObject = parser.parse(exampleValidStructure);

        expect(parsedObject).to.have.property('by-key', true);
      });
    });
  });
});
