import express from 'express';
import { ControllerRequestArguments } from '../../../controller/types/controller-request-arguments';
import { ArgumentExtractor } from '../types/argument-extractor';

const ExtractorLibrary: Record<string, ArgumentExtractor> = {
  queryExtractor,
  namedParamsExtractor,
  bodyExtractor,
};

export default ExtractorLibrary;

function queryExtractor(request: express.Request): ControllerRequestArguments {
  return Object.entries(request.query)
    .map(([name, value]) => ({ name: name as string, value: value as string }));
}

function namedParamsExtractor(request: express.Request): ControllerRequestArguments {
  return Object.entries(request.params)
    .filter(([, value]) => value)
    .map(([name, value]) => ({ name: name as string, value: value as string }));
}

function bodyExtractor(request: express.Request): ControllerRequestArguments {
  return Object.entries(request.body)
    .map(([name, value]) => ({ name: name as string, value: typeof value === 'object' ? JSON.stringify(value) : value as string }));
}
