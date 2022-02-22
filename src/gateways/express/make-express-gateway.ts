import { readFileSync } from 'fs';
import Controller from '../../controller/controller';
import ErrorMap from './consts/error-map';
import ExtractorLibrary from './consts/extractor-library';
import ExpressGateway from './expres-gateway';

export default function makeExpressGateway(controller: Controller, schemaPath: string) {
  const rawSchema = readFileSync(schemaPath, { encoding: 'utf-8' });
  return new ExpressGateway(
    controller,
    rawSchema,
    ExtractorLibrary,
    ErrorMap,
  );
}
