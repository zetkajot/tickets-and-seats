import { RequestConverter } from '../request-converters/make-input-converter';
import { UseCaseConstructor } from './use-case-constructor';

export type ActionSchema = {
  [k: string]: {
    converter: RequestConverter;
    UseCase: UseCaseConstructor<any, any>;
  };
};
