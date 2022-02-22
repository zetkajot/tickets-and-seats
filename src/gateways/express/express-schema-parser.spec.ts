/* eslint-disable arrow-body-style */
import { expect } from 'chai';
import Sinon from 'sinon';
import ExpressRouteHandler from './express-route-handler';
import ExpressSchemaParser from './express-schema-parser';
import { ArgumentExtractor } from './types/argument-extractor';
import ExpressActionHandler from './express-action-handler';

const dummyRouteHandler = {
  addRoute: Sinon.spy(),
} as unknown as ExpressRouteHandler;
const dummyActionHandler = {
  makeRequestHandler: Sinon.spy(),
} as unknown as ExpressActionHandler;

const fakeExtractorLib = {
  bodyExtractor: () => undefined,
} as unknown as Record<string, ArgumentExtractor>;

const exampleValidSchema = `{
  "routes": [
    {
      "actionSignature": "action1",
      "method": "GET",
      "path": "/my/path",
      "argumentExtractor": "bodyExtractor"
    }
  ]
}
`;

describe('Express Schema Parser test suite', () => {
  let schemaParser: ExpressSchemaParser;
  before(() => {
    schemaParser = new ExpressSchemaParser(dummyRouteHandler, dummyActionHandler, fakeExtractorLib);
  });
  describe('When loaded schema file is invalid', () => {
    it('Should throw an error', () => {
      const tryParsing = () => schemaParser.parse('not-a-valid-schema');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(tryParsing).to.throw;
    });
  });
  describe('When schema was successfuly loaded and parsed', () => {
    it('Should add route with correct method & handler', () => {
      schemaParser.parse(exampleValidSchema);
      expect(dummyActionHandler.makeRequestHandler)
        .to.have.been.calledOnceWithExactly('action1', fakeExtractorLib.bodyExtractor);
      expect(dummyRouteHandler.addRoute).to.have.been.calledOnceWith('GET', '/my/path');
    });
  });
});
