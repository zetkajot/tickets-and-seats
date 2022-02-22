import { HTTPOptions } from './http-options';

export type HTTPSOptions = {
  key: Buffer,
  cert: Buffer
} & HTTPOptions;
