import { expect } from 'chai';
import e from 'express';
import Sinon from 'sinon';
import Controller from '../../controller/controller';
import { ControllerResponse } from '../../controller/types/controller-response';
import ExpressActionHandler from './express-action-handler';
import { ArgumentExtractor } from './types/argument-extractor';
import { HTTPErrorCodeMap } from './types/http-error-code-map';
import { RequestHandler } from './types/request-handler';

const okControllerResponse: ControllerResponse = { isOk: true, data: { some: 'data' } };
const failControllerResponse: ControllerResponse = { isOk: false, error: new Error('fail') };
const dummyArgExtractor = Sinon.spy(() => undefined as any) as ArgumentExtractor;
const dummyController = {
  getActionHandler: Sinon.spy(
    (a: string) => (a ? () => okControllerResponse : () => failControllerResponse),
  ),
} as unknown as Controller;
const dummyRequest = {} as e.Request;
const dummyResponse = {
  status: Sinon.spy(),
  contentType: Sinon.spy(),
  send: Sinon.spy(),
} as unknown as e.Response;
const fakeErrorCodeMap = {
  Error: 301,
} as HTTPErrorCodeMap;

describe('Express Action Handler test suite', () => {
  let actionHandler: ExpressActionHandler;
  before(() => {
    actionHandler = new ExpressActionHandler(dummyController, fakeErrorCodeMap);
  });
  describe('When making a request handler', () => {
    it('Should request a hook for given action from controller', () => {
      actionHandler.makeRequestHandler('some signature', dummyArgExtractor);
      expect(dummyController.getActionHandler)
        .to.have.been.calledOnceWithExactly('some signature');
    });
  });
  describe('Produced request handler', () => {
    let okHandler: RequestHandler;
    before(async () => {
      Sinon.reset();
      okHandler = actionHandler.makeRequestHandler('some signature', dummyArgExtractor);
      await okHandler(dummyRequest, dummyResponse);
    });
    it('Should extract args from request using extractor provided at the start', () => {
      expect(dummyArgExtractor).to.have.been.calledOnceWithExactly(dummyRequest);
    });
    it('Should call hook recievied earlier from controller', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(dummyController.getActionHandler).to.have.been.calledOnce;
    });
    describe('When controller response indicates success', () => {
      it('Should set response code to 200', () => {
        expect(dummyResponse.status).to.have.been.calledOnceWith(200);
      });
      it('Should set Content-type to application/json', () => {
        expect(dummyResponse.contentType).to.have.been.calledOnceWith('application/json');
      });
      it('Should send response with data recieved from controller', () => {
        expect(dummyResponse.send).to.have.been.calledOnceWithExactly({
          isOk: true,
          data: { some: 'data' },
        });
      });
    });
    describe('When controller response indicates failure', () => {
      let failHandler: RequestHandler;
      before(async () => {
        Sinon.reset();
        failHandler = actionHandler.makeRequestHandler('', dummyArgExtractor);
        await failHandler(dummyRequest, dummyResponse);
      });
      it('Should set response code according to returned error', () => {
        expect(dummyResponse.status).to.have.been.calledOnceWithExactly(301);
      });
      it('Should set Content-type to application/json', () => {
        expect(dummyResponse.contentType).to.have.been.calledOnceWithExactly('application/json');
      });
      it('Should send response with error name and message', () => {
        expect(dummyResponse.send).to.have.been.calledOnceWithExactly({
          isOk: false,
          errorName: 'Error',
          errorMessage: 'fail',
        });
      });
    });
  });
});
