import JSONSchemaParser from '../../utils/json-schema-parser/json-schema-parser';
import { JSONParserSchema } from '../../utils/json-schema-parser/types/json-parser-schema';
import ExpressActionHandler from './express-action-handler';
import ExpressRouteHandler from './express-route-handler';
import makeRouteSchema from './make-route-schema';
import { ArgumentExtractor } from './types/argument-extractor';
import { ExpressRouteSchema } from './types/express-route-schema';

export default class ExpressSchemaParser {
  private JSONRouteSchema: JSONParserSchema;

  constructor(
    private routeHandler: ExpressRouteHandler,
    private actionHandler: ExpressActionHandler,
    private extractorLibrary: Record<string, ArgumentExtractor>,
  ) {
    this.JSONRouteSchema = makeRouteSchema(extractorLibrary);
  }

  parse(rawSchema: string): void {
    const parser = new JSONSchemaParser<ExpressRouteSchema>(this.JSONRouteSchema);
    parser.forKey('argumentExtractor', (name, value) => [name, this.extractorLibrary[value]]);
    const routeSchema = parser.parse(rawSchema);
    this.processSchema(routeSchema);
  }

  private processSchema(routeSchema: ExpressRouteSchema) {
    routeSchema.routes.forEach(({
      actionSignature, argumentExtractor, path, method,
    }) => {
      const requestHandler = this.actionHandler.makeRequestHandler(
        actionSignature,
        argumentExtractor,
      );
      this.routeHandler.addRoute(method, path, requestHandler);
    });
  }
}
