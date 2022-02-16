import { expect } from 'chai';
import { ControllerRequestArguments } from '../types/controller-request-arguments';
import ConversionError, { ConversionErrorSubtype } from './conversion-error';
import convertRequestArguments from './convert-request-arguments';
import { FailedConversion, SuccessfulConversion } from './types/conversion-result';
import { InputSchema, InputSchemaType } from './types/input-schema';

describe('Request Args Converter test suite', () => {
  describe('When conversion fails', () => {
    describe('beacuse of missing parameter', () => {
      it('failReasons has entries for missing parameters names which are set to ConversionError.MISSING_PARAMETER', () => {
        const schema: InputSchema = [{ argName: 'arg1' }, { argName: 'arg2' }];
        const invalidArgs: ControllerRequestArguments = [{ name: 'arg2', value: 'val' }];

        const conversionResult = convertRequestArguments(schema, invalidArgs);

        expect(conversionResult.wasSuccessful).to.equal(false);
        expect((conversionResult as FailedConversion).failReasons.arg1)
          .to.be.an.instanceOf(ConversionError)
          .with.property('subtype', ConversionErrorSubtype.MISSING_PARAMETER);
      });
    });
    describe('because of duplicated parameter', () => {
      it('failReasons has entries for duplicated parameters names which are set to ConversionError.DUPLICATE_PARAMETER', () => {
        const schema: InputSchema = [
          { argName: 'arg1' }, { argName: 'arg2' },
        ];
        const invalidArgs: ControllerRequestArguments = [
          { name: 'arg1', value: 'foo' }, { name: 'arg1', value: 'bar' },
        ];

        const conversionResult = convertRequestArguments(schema, invalidArgs);

        expect(conversionResult.wasSuccessful).to.equal(false);
        expect((conversionResult as FailedConversion).failReasons.arg1)
          .to.be.an.instanceOf(ConversionError)
          .with.property('subtype', ConversionErrorSubtype.DUPLICATE_PARAMETER);
      });
    });
    describe('beacuse of type conversion fail', () => {
      it('failReasons has entries for invalid parameters names which are set to ConversionError with appropiate subtype', () => {
        const schema: InputSchema = [
          { argName: 'arg1', type: InputSchemaType.DATE }, { argName: 'arg2', type: InputSchemaType.OBJECT },
        ];
        const invalidArgs: ControllerRequestArguments = [
          { name: 'arg1', value: 'not-a-date' }, { name: 'arg2', value: 'not-an-obj' },
        ];

        const conversionResult = convertRequestArguments(schema, invalidArgs);

        expect(conversionResult.wasSuccessful).to.equal(false);
        expect((conversionResult as FailedConversion).failReasons.arg1)
          .to.be.an.instanceOf(ConversionError)
          .with.property('subtype', ConversionErrorSubtype.NOT_A_DATE);
        expect((conversionResult as FailedConversion).failReasons.arg2)
          .to.be.an.instanceOf(ConversionError)
          .with.property('subtype', ConversionErrorSubtype.NOT_AN_OBJECT);
      });
    });
  });
  describe('When conversion succeeds', () => {
    describe('When parameter is not required', () => {
      describe('When parameter was not set', () => {
        it('Sets its value to undefined', () => {
          const schema: InputSchema = [{ argName: 'arg1', required: false }];
          const validArgs: ControllerRequestArguments = [];

          const conversionResult = convertRequestArguments(schema, validArgs);

          expect(conversionResult.wasSuccessful).to.equal(true);
          expect((conversionResult as SuccessfulConversion).convertedData.arg1)
            .to.equal(undefined);
        });
      });
      describe('When parameter was set', () => {
        it('Sets its value to the original(possibly converted) one', () => {
          const schema: InputSchema = [{ argName: 'arg1', required: false }];
          const validArgs: ControllerRequestArguments = [{ name: 'arg1', value: 'some-val' }];

          const conversionResult = convertRequestArguments(schema, validArgs);

          expect(conversionResult.wasSuccessful).to.equal(true);
          expect((conversionResult as SuccessfulConversion).convertedData.arg1)
            .to.equal('some-val');
        });
      });
    });
    describe('When parameter has no type set', () => {
      it('its value is an original string', () => {
        const schema: InputSchema = [{ argName: 'arg1' }];
        const validArgs: ControllerRequestArguments = [{ name: 'arg1', value: '124' }];

        const conversionResult = convertRequestArguments(schema, validArgs);

        expect(conversionResult.wasSuccessful).to.equal(true);
        expect((conversionResult as SuccessfulConversion).convertedData.arg1)
          .to.equal('124');
      });
    });
    describe('When parameter has type set', () => {
      it('its value is a result of conversion of original string into set type', () => {
        const schema: InputSchema = [{ argName: 'arg1', type: InputSchemaType.NUMBER }];
        const validArgs: ControllerRequestArguments = [{ name: 'arg1', value: '124' }];

        const conversionResult = convertRequestArguments(schema, validArgs);

        expect(conversionResult.wasSuccessful).to.equal(true);
        expect((conversionResult as SuccessfulConversion).convertedData.arg1)
          .to.equal(124);
      });
    });
    describe('When parameter has no desired name set', () => {
      it('its name is the same as the argument name', () => {
        const schema: InputSchema = [{ argName: 'arg1' }];
        const validArgs: ControllerRequestArguments = [{ name: 'arg1', value: 'some-val' }];

        const conversionResult = convertRequestArguments(schema, validArgs);

        expect(conversionResult.wasSuccessful).to.equal(true);
        expect((conversionResult as SuccessfulConversion).convertedData)
          .to.have.property('arg1', 'some-val');
      });
    });
    describe('When parameter has desired name set', () => {
      it('its name is set to desired name', () => {
        const schema: InputSchema = [{ argName: 'arg1', desiredName: 'newName' }];
        const validArgs: ControllerRequestArguments = [{ name: 'arg1', value: 'some-val' }];

        const conversionResult = convertRequestArguments(schema, validArgs);

        expect(conversionResult.wasSuccessful).to.equal(true);
        expect((conversionResult as SuccessfulConversion).convertedData)
          .to.have.property('newName', 'some-val');
      });
    });
  });
});
