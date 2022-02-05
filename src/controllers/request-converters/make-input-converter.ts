import { ControllerRequest } from '../types/controller-request';

type ConverterFactorySettings = ({
  argumentName: string,
  desiredName?: string,
  valueConverter?: (value: string) => any,
} | string)[];

type Converter<T> = (request: ControllerRequest) => T;

export default function makeInputConverter<T>(...settings: ConverterFactorySettings): Converter<T> {
  throw new Error('Unimplemented!');
}
