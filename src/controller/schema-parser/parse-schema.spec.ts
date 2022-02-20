import { expect } from 'chai';
import path from 'path';
import parseSchema from './parse-schema';
import ControllerSchemaError, { ControllerSchemaErrorSubtype } from './controller-schema-error';
import FindEventById from '../../use-cases/event/find-event-by-id';
import { InputSchemaType } from '../argument-converters/types/input-schema';

describe('Controller Schema Parser test suite', () => {
  describe('When schema was not found', () => {
    it('Throws ControllerSchemaError.MISSING_SCHEMA', () => {
      const schemaPath = 'invalid\\schema\\path';

      const tryParsing = () => parseSchema(schemaPath);

      expect(tryParsing)
        .to.throw(ControllerSchemaError)
        .with.property('subtype', ControllerSchemaErrorSubtype.MISSING_SCHEMA);
    });
  });
  describe('When schema was found', () => {
    describe('When schema is valid JSON', () => {
      describe('When schema has valid structure', () => {
        describe('When action references name of known use case constructor', () => {
          it('Use case constructor is resolved into real constructor', () => {
            const schemaPath = path.join(__dirname, 'test-schemas', 'valid.json');

            const parsedSchema = parseSchema(schemaPath);

            expect(parsedSchema.actions.findEvent['use-case']).to.deep.equal(FindEventById);
          });
        });
        describe('When action references name of unknown use case constructor', () => {
          it('Throws ControllerSchemaError.UNKNOWN_USECASE', () => {
            const schemaPath = path.join(__dirname, 'test-schemas', 'unknown_usecase.json');

            const tryParsing = () => parseSchema(schemaPath);

            expect(tryParsing)
              .to.throw(ControllerSchemaError)
              .with.property('subtype', ControllerSchemaErrorSubtype.UNKNOWN_USECASE);
          });
        });
        describe('When input schema references known type', () => {
          it('Is resolved into InputSchemaType', () => {
            const schemaPath = path.join(__dirname, 'test-schemas', 'valid.json');

            const parsedSchema = parseSchema(schemaPath);

            expect(parsedSchema.actions.findEvent['input-schema'][0].type).to.equal(InputSchemaType.STRING);
          });
        });
        describe('When input schema references unknown type', () => {
          it('Throws ControllerSchemaError.UNKNOWN_TYPE', () => {
            const schemaPath = path.join(__dirname, 'test-schemas', 'unknown_type.json');

            const tryParsing = () => parseSchema(schemaPath);

            expect(tryParsing)
              .to.throw(ControllerSchemaError)
              .with.property('subtype', ControllerSchemaErrorSubtype.UNKNOWN_TYPE);
          });
        });
      });
      describe('When schema has invalid structure', () => {
        it('Throws ControllerSchemaError.INVALID_STRUCTURE', () => {
          const schemaPath = path.join(__dirname, 'test-schemas', 'invalid_structure.json');

          const tryParsing = () => parseSchema(schemaPath);

          expect(tryParsing)
            .to.throw(ControllerSchemaError)
            .with.property('subtype', ControllerSchemaErrorSubtype.INVALID_STRUCTURE);
        });
      });
    });
    describe('When schema is invalid JSON', () => {
      it('Throws ControllerSchemaError.INVALID_JSON', () => {
        const schemaPath = path.join(__dirname, 'test-schemas', 'invalid_json.json');

        const tryParsing = () => parseSchema(schemaPath);

        expect(tryParsing)
          .to.throw(ControllerSchemaError)
          .with.property('subtype', ControllerSchemaErrorSubtype.INVALID_JSON);
      });
    });
  });
});
