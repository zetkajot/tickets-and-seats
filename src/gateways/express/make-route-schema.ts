import ParserType from '../../utils/json-schema-parser/parser-type';
import { array, inValues } from '../../utils/json-schema-parser/parser-utility-functions';
import { ArgumentExtractor } from './types/argument-extractor';

export default function makeRouteSchema(extractorLibrary: Record<string, ArgumentExtractor>) {
  return {
    routes: array({
      actionSignature: ParserType.STRING,
      method: inValues(['GET', 'POST', 'PUT', 'DELETE']),
      path: ParserType.STRING,
      argumentExtractor: inValues(Object.keys(extractorLibrary)),
    }),
  };
}
