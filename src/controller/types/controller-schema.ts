import { InputSchemaType } from '../argument-converters/types/input-schema';
import { UseCaseConstructor } from './use-case-constructor';

export type ControllerSchema = {
  actions: {
    [actionSignature: string]: {
      'use-case': UseCaseConstructor<unknown, unknown>,
      'input-schema': {
        argName: string,
        desiredName?: string,
        required?: boolean,
        type?: InputSchemaType,
      }[];
    }
  }
};
