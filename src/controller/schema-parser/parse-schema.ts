import { PathOrFileDescriptor, readFileSync } from 'fs';
import { InputSchemaType } from '../argument-converters/types/input-schema';
import { ControllerSchema } from '../types/controller-schema';
import { UseCaseConstructor } from '../types/use-case-constructor';
import ControllerSchemaError, { ControllerSchemaErrorSubtype } from './controller-schema-error';
import inputSchemaTypesLibrary from './input-schema-types-library';
import useCaseConstructorLibrary from './use-case-constructor-library';

export default function parseSchema(location: PathOrFileDescriptor): ControllerSchema {
  let fileContent;
  try {
    fileContent = readFileSync(location, {
      encoding: 'utf8',
    });
  } catch {
    throw new ControllerSchemaError(ControllerSchemaErrorSubtype.MISSING_SCHEMA);
  }
  const parsedFileContent = tryParsingJSON(fileContent);
  validateStructure(parsedFileContent);
  return parsedFileContent;
}

function tryParsingJSON(data: string) {
  try {
    return JSON.parse(data, validateKeyValues);
  } catch (error) {
    if (error instanceof ControllerSchemaError) throw error;
    throw new ControllerSchemaError(ControllerSchemaErrorSubtype.INVALID_JSON);
  }
}

function validateKeyValues(key: string, value: string) {
  if (key === 'use-case') {
    return parseUseCase(value);
  } if (key === 'type') {
    return parseType(value);
  }
  return value;
}

function parseUseCase(value: string): UseCaseConstructor<unknown, unknown> {
  if (value in useCaseConstructorLibrary) {
    return useCaseConstructorLibrary[value as keyof typeof useCaseConstructorLibrary];
  }
  throw new ControllerSchemaError(ControllerSchemaErrorSubtype.UNKNOWN_USECASE);
}

function parseType(value: string): InputSchemaType {
  if (value in inputSchemaTypesLibrary) {
    return inputSchemaTypesLibrary[value as keyof typeof inputSchemaTypesLibrary];
  }
  throw new ControllerSchemaError(ControllerSchemaErrorSubtype.UNKNOWN_TYPE);
}

function validateStructure(obj: any) {
  if (typeof obj.actions !== 'object') {
    throw new ControllerSchemaError(ControllerSchemaErrorSubtype.INVALID_STRUCTURE);
  }
  Object.entries(obj.actions).forEach(([, value]) => {
    if (typeof (value as any)['use-case'] !== 'function' || !Array.isArray((value as any)['input-schema'])) {
      throw new ControllerSchemaError(ControllerSchemaErrorSubtype.INVALID_STRUCTURE);
    }
    ((value as any)['input-schema'] as Array<object>).forEach((schemaEntry) => {
      const hasAnyForeignKeys = Object.keys(schemaEntry)
        .some(
          (key) => key !== 'argName'
          && key !== 'desiredName'
          && key !== 'required'
          && key !== 'type',
        );
      const hasRequiredKeys = Object.keys(schemaEntry).includes('argName');
      if (hasAnyForeignKeys || !hasRequiredKeys) {
        throw new ControllerSchemaError(ControllerSchemaErrorSubtype.INVALID_STRUCTURE);
      }
    });
  });
}
