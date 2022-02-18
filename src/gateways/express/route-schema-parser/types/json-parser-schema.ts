import { ParserAllowedValues } from './parser-allowed-values';

export type JSONParserSchema = {
  [k: string]: ParserAllowedValues | JSONParserSchema;
};
