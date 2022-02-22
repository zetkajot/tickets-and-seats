import { expect } from 'chai';
import e, { RequestHandler } from 'express';
import Sinon from 'sinon';
import ExpressRouteHandler from './express-route-handler';

const dummyExpressApp = {
  get: Sinon.spy(),
  post: Sinon.spy(),
  put: Sinon.spy(),
  delete: Sinon.spy(),
} as unknown as e.Application;

const fakeRequestHandler = (() => undefined) as RequestHandler;
describe('Express Route Handler test suite', () => {
  let routeHandler: ExpressRouteHandler;
  before(() => {
    routeHandler = new ExpressRouteHandler(dummyExpressApp);
  });
  describe('When adding GET route', () => {
    it('Should set handler for given path & method on express app', () => {
      routeHandler.addRoute('GET', '/some-path', fakeRequestHandler);
      expect(dummyExpressApp.get)
        .to.have.been.calledOnceWithExactly('/some-path', fakeRequestHandler);
    });
  });
  describe('When adding POST route', () => {
    it('Should set handler for given path & method on express app', () => {
      routeHandler.addRoute('POST', '/some-path', fakeRequestHandler);
      expect(dummyExpressApp.post)
        .to.have.been.calledOnceWithExactly('/some-path', fakeRequestHandler);
    });
  });
  describe('When adding PUT route', () => {
    it('Should set handler for given path & method on express app', () => {
      routeHandler.addRoute('PUT', '/some-path', fakeRequestHandler);
      expect(dummyExpressApp.put)
        .to.have.been.calledOnceWithExactly('/some-path', fakeRequestHandler);
    });
  });
  describe('When adding DELETE route', () => {
    it('Should set handler for given path & method on express app', () => {
      routeHandler.addRoute('DELETE', '/some-path', fakeRequestHandler);
      expect(dummyExpressApp.delete)
        .to.have.been.calledOnceWithExactly('/some-path', fakeRequestHandler);
    });
  });
  describe('When adding route for unknown method', () => {
    it('Should throw an error', () => {
      const tryAddingRoute = () => routeHandler.addRoute('unknown-route' as any, '/some-path', fakeRequestHandler);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(tryAddingRoute).to.throw;
    });
  });
});
