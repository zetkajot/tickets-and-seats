import { ControllerRequestArguments } from '../types/controller-request-arguments';
import ConversionError, { ConversionErrorSubtype } from './conversion-error';
import tryConvertingToType from './type-converters/try-converting-to-type';
import { ConversionResult, FailedConversion, SuccessfulConversion } from './types/conversion-result';
import { InputSchema, InputSchemaEntry, InputSchemaType } from './types/input-schema';

export default function convertRequestArguments(
  schema: InputSchema,
  requestArgs: ControllerRequestArguments,
): ConversionResult {
  const defaultizedSchema = fillSchemaWithDefaults(schema);
  const [requiredArgsSchema, optionalArgsSchema] = mapSchemaEntries(defaultizedSchema);

  const resultsMap = new Map<string, any>();
  const errorsMap = new Map<string, ConversionError>();

  // eslint-disable-next-line no-restricted-syntax
  for (const [requiredArgName, requiredArgSchema] of requiredArgsSchema) {
    const matchingArgs = requestArgs.filter((arg) => arg.name === requiredArgName);
    if (matchingArgs.length > 1) {
      errorsMap.set(
        requiredArgName,
        new ConversionError(ConversionErrorSubtype.DUPLICATE_PARAMETER),
      );
    } else if (matchingArgs.length === 0) {
      errorsMap.set(
        requiredArgName,
        new ConversionError(ConversionErrorSubtype.MISSING_PARAMETER),
      );
    } else {
      const requestArg = matchingArgs[0];

      const typeConversionResult = tryConvertingToType(
        requiredArgSchema.type as InputSchemaType,
        requestArg.value,
      );
      if (typeConversionResult.isOk) {
        const parameterValue = typeConversionResult.value;
        resultsMap.set(requiredArgSchema.desiredName as string, parameterValue);
      } else {
        errorsMap.set(requestArg.name, typeConversionResult.error);
      }
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [optionalArgName] of optionalArgsSchema) {
    const matchingArgs = requestArgs.filter((arg) => arg.name === optionalArgName);
    resultsMap.set(optionalArgName, matchingArgs[0]?.value);
  }
  if (errorsMap.size > 0) {
    return convertErrorsMapToConversionResult(errorsMap);
  }
  return convertResultsMapToConversionResult(resultsMap);
}

function fillSchemaWithDefaults(schema: InputSchema): InputSchema {
  return schema.map(({
    argName, desiredName, required, type,
  }) => ({
    argName,
    desiredName: desiredName ?? argName,
    required: required ?? true,
    type: type ?? InputSchemaType.STRING,
  }));
}

function mapSchemaEntries(

  schema: InputSchema,
): [
  requiredSchemaEntries: Map<string, InputSchemaEntry>,
  requiredSchemaEntries: Map<string, InputSchemaEntry>,
  ] {
  const required = new Map();
  const optional = new Map();
  schema.forEach((schemaEntry) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    schemaEntry.required
      ? required.set(schemaEntry.argName, schemaEntry)
      : optional.set(schemaEntry.argName, schemaEntry);
  });
  return [required, optional];
}

function convertResultsMapToConversionResult(resultsMap: Map<string, any>): SuccessfulConversion {
  const baseResult = {
    wasSuccessful: true,
    convertedData: {},
  } as SuccessfulConversion;
  resultsMap.forEach((value, name) => {
    baseResult.convertedData[name] = value;
  });
  return baseResult;
}

function convertErrorsMapToConversionResult(
  errorsMap: Map<string, ConversionError>,
): FailedConversion {
  const baseResult: FailedConversion = {
    wasSuccessful: false,
    failReasons: {},
  };

  errorsMap.forEach((error, name) => {
    baseResult.failReasons[name] = error;
  });

  return baseResult;
}
