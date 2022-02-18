import { ParserAllowedValue } from './parser-allowed-values';

export type JSONParserSchema = {
  [k: string]: ParserAllowedValue | JSONParserSchema;
};
