import UseCase from '../../use-cases/use-case';
import { RequestConverter } from '../request-converters/make-input-converter';

export type Actions = {
  [k: string]: {
    converter: RequestConverter;
    useCase: UseCase<any, any>;
  };
};
