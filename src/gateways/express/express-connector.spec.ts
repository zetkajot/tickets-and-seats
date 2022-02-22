/* eslint-disable arrow-body-style */
import { expect } from 'chai';
import e from 'express';
import { Server as HTTPServer } from 'http';
import { Server as HTTPSServer } from 'https';
import Sinon, { SinonSpy } from 'sinon';
import ExpressConnector from './express-connector';
import { HTTPOptions } from './types/http-options';
import { HTTPServerCreator } from './types/http-server-creator';
import { HTTPSOptions } from './types/https-options';
import { HTTPSServerCreator } from './types/https-server-creator';

const fakeExpressApp = { express: 'is nice' } as unknown as e.Application;

const dummyHTTPServerCreator = Sinon.spy(() => dummyHTTPServer) as HTTPServerCreator;
const dummyHTTPServer = {
  close: Sinon.spy(() => ({ on: (ev: string, cb: ()=>any) => cb() })),
  listen: Sinon.spy(() => ({ on: (ev: string, cb: ()=>any) => cb() })),
} as unknown as HTTPServer;
const fakeHTTPServerOptions = { host: '0.0.0.1', port: 1234 } as HTTPOptions;

const dummyHTTPSServerCreator = Sinon.spy(() => dummyHTTPSServer) as HTTPSServerCreator;
const dummyHTTPSServer = dummyHTTPServer as unknown as HTTPSServer;
const fakeHTTPSServerOptions = { host: '0.0.0.1', port: 1234 } as unknown as HTTPSOptions;

describe('Express Connector test suite', () => {
  beforeEach(() => {
    Sinon.reset();
  });
  describe('When HTTP gateway is closed', () => {
    let connector: ExpressConnector;
    before(() => {
      connector = new ExpressConnector(fakeExpressApp);
    });
    it('Should throw when trying to close it again', () => {
      return expect(connector.closeHTTP())
        .to.eventually.be.rejected;
    });
    it('Should not throw when trying to open it', () => {
      return expect(connector.openHTTP(dummyHTTPServerCreator, fakeHTTPServerOptions))
        .to.eventually.be.fulfilled;
    });
  });
  describe('When HTTP gateway is opening', () => {
    let connector: ExpressConnector;
    before(() => {
      connector = new ExpressConnector(fakeExpressApp);
    });
    it('Should setup a new HTTP Server using given creator and expressApp', async () => {
      await connector.openHTTP(dummyHTTPServerCreator, fakeHTTPServerOptions);
      expect(dummyHTTPServerCreator).to.have.been.calledOnceWith(fakeExpressApp);
      expect(dummyHTTPServer.listen).to.have.been.calledOnceWithExactly(1234, '0.0.0.1');
    });
  });
  describe('When HTTP gateway is open', () => {
    let connector: ExpressConnector;
    before(async () => {
      connector = new ExpressConnector(fakeExpressApp);
      await connector.openHTTP(dummyHTTPServerCreator, fakeHTTPServerOptions);
    });
    it('Should throw when trying to open it again', () => {
      return expect(connector.openHTTP(dummyHTTPServerCreator, fakeHTTPServerOptions))
        .to.eventually.be.rejected;
    });
    it('Should not throw when trying to close it', () => {
      return expect(connector.closeHTTP())
        .to.eventually.be.fulfilled;
    });
  });
  describe('When HTTP gateway is closing', () => {
    let connector: ExpressConnector;
    before(async () => {
      connector = new ExpressConnector(fakeExpressApp);
      await connector.openHTTP(dummyHTTPServerCreator, fakeHTTPServerOptions);
    });
    it('Should stop underlying HTTP Server', async () => {
      await connector.closeHTTP();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(dummyHTTPServer.close as SinonSpy)
        .to.have.been.calledOnce;
    });
  });
  describe('When HTTPS gateway is closed', () => {
    let connector: ExpressConnector;
    before(() => {
      connector = new ExpressConnector(fakeExpressApp);
    });
    it('Should throw when trying to close it again', () => {
      return expect(connector.closeHTTPS())
        .to.eventually.be.rejected;
    });
    it('Should not throw when trying to open it', () => {
      return expect(connector.openHTTPS(dummyHTTPSServerCreator, fakeHTTPSServerOptions))
        .to.eventually.be.fulfilled;
    });
  });
  describe('When HTTPS gateway is opening', () => {
    let connector: ExpressConnector;
    before(() => {
      connector = new ExpressConnector(fakeExpressApp);
    });
    it('Should setup a new HTTPS Server using given creator and expressApp', async () => {
      await connector.openHTTPS(dummyHTTPSServerCreator, fakeHTTPSServerOptions);
      expect(dummyHTTPSServerCreator)
        .to.have.been.calledOnceWith({ key: undefined, cert: undefined }, fakeExpressApp);
      expect(dummyHTTPSServer.listen)
        .to.have.been.calledOnceWithExactly(1234, '0.0.0.1');
    });
  });
  describe('When HTTPS gateway is open', () => {
    let connector: ExpressConnector;
    before(async () => {
      connector = new ExpressConnector(fakeExpressApp);
      await connector.openHTTPS(dummyHTTPSServerCreator, fakeHTTPSServerOptions);
    });
    it('Should throw when trying to open it again', () => {
      return expect(connector.openHTTPS(dummyHTTPSServerCreator, fakeHTTPSServerOptions))
        .to.eventually.be.rejected;
    });
    it('Should not throw when trying to close it', () => {
      return expect(connector.closeHTTPS())
        .to.eventually.be.fulfilled;
    });
  });
  describe('When HTTPS gateway is closing', () => {
    let connector: ExpressConnector;
    before(async () => {
      connector = new ExpressConnector(fakeExpressApp);
      await connector.openHTTPS(dummyHTTPSServerCreator, fakeHTTPSServerOptions);
    });
    it('Should stop underlying HTTPS Server', async () => {
      await connector.closeHTTPS();
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(dummyHTTPSServer.close as SinonSpy)
        .to.have.been.calledOnce;
    });
  });
});
