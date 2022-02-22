import express from 'express';
import { join } from 'path';
import Controller from '../../controller/controller';
import ExpressActionHandler from './express-action-handler';
import ExpressConnector from './express-connector';
import ExpressRouteHandler from './express-route-handler';
import ExpressSchemaParser from './express-schema-parser';
import { ArgumentExtractor } from './types/argument-extractor';

export default class ExpressGateway {
  public readonly expressApp: express.Application;

  public readonly connector: ExpressConnector;

  constructor(
    controller: Controller,
    routeSchema: string,
    extractorLib: Record<string, ArgumentExtractor>,
    errorCodeMap: Record<string, number | Record<number, number>>,
  ) {
    this.expressApp = express();

    this.expressApp.use(express.json());
    this.expressApp.use('/', express.static(join(process.cwd(), 'static')));

    this.connector = new ExpressConnector(this.expressApp);
    const routeHandler = new ExpressRouteHandler(this.expressApp);
    const actionHandler = new ExpressActionHandler(controller, errorCodeMap);
    const schemaParser = new ExpressSchemaParser(routeHandler, actionHandler, extractorLib);
    schemaParser.parse(routeSchema);
  }
}
