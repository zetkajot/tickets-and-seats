import express from 'express';
import { readFileSync } from 'fs';
import { ControllerRequestArguments } from '../../controller/types/controller-request-arguments';
import JSONSchemaParser from '../../utils/json-schema-parser/json-schema-parser';
import ParserType from '../../utils/json-schema-parser/parser-type';
import { array, inValues } from '../../utils/json-schema-parser/parser-utility-functions';
import { JSONParserSchema } from '../../utils/json-schema-parser/types/json-parser-schema';
import { ArgumentExtractor } from './types/argument-extractor';
import { ExpressRouteSchema } from './types/express-route-schema';

const argumentExtractorLibrary: Record<string, ArgumentExtractor> = {
  extractArgsFromQuery,
  extractArgsFromNamedParams,
  extractArgsFromBody,
};

const routeSchema: JSONParserSchema = {
  routes: array({
    actionSignature: ParserType.STRING,
    method: inValues(['GET', 'POST', 'PUT', 'DELETE']),
    path: ParserType.STRING,
    argumentExtractor: inValues(Object.keys(argumentExtractorLibrary)),
  }),
};

function makeRouteSchemaParser() {
  const routeSchemaParser = new JSONSchemaParser<ExpressRouteSchema>(routeSchema);
  routeSchemaParser.forKey('argumentExtractor', (name, value) => [name, argumentExtractorLibrary[value]]);
  return routeSchemaParser;
}

export default function parseRouteSchema(pathToRouteSchema: string): ExpressRouteSchema {
  const rawRouteSchema = readFileSync(pathToRouteSchema, { encoding: 'utf-8' });
  return makeRouteSchemaParser().parse(rawRouteSchema);
}

function extractArgsFromQuery(request: express.Request): ControllerRequestArguments {
  return Object.entries(request.query)
    .map(([name, value]) => ({ name: name as string, value: value as string }));
}

function extractArgsFromNamedParams(request: express.Request): ControllerRequestArguments {
  return Object.entries(request.params)
    .filter(([, value]) => value)
    .map(([name, value]) => ({ name: name as string, value: value as string }));
}

function extractArgsFromBody(request: express.Request): ControllerRequestArguments {
  return Object.entries(request.body)
    .map(([name, value]) => ({ name: name as string, value: typeof value === 'object' ? JSON.stringify(value) : value as string }));
}
