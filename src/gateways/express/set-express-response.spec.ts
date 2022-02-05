import { expect } from 'chai';
import { Response } from 'express';
import Sinon from 'sinon';
import { ControllerResponse } from '../../controllers/types/controller-response';
import setExpressResponse from './set-express-response';

const dummyResponse = {
  send: () => undefined,
  stauts: () => undefined,
  type: () => undefined,
} as unknown as Response;

const exampleControllerOkResponse = {
  isOk: true,
  data: {
    someField: 'someData',
  },
} as ControllerResponse;

const exampleControllerErrorResponse = {
  isOk: false,
  errorName: 'ExampleError',
  errorMessage: 'Some message',
} as ControllerResponse;

describe('setExpressResponse test suite', () => {
  before(() => {
    dummyResponse.status = Sinon.spy();
    dummyResponse.type = Sinon.spy();
    dummyResponse.send = Sinon.spy();
  });
  beforeEach(() => {
    Sinon.reset();
  });
  it('Sets \'Content-Type\' to \'application/json\'', () => {
    setExpressResponse(dummyResponse, exampleControllerErrorResponse);

    expect(dummyResponse.type).to.have.been.calledOnceWithExactly('application/json');
  });
  it('Sends stringified controller response with res.send()', () => {
    setExpressResponse(dummyResponse, exampleControllerOkResponse);
    const stringifiedResponse = JSON.stringify(exampleControllerOkResponse);

    expect(dummyResponse.send).to.have.been.calledOnceWithExactly(stringifiedResponse);
  });
  describe('When controller response is Ok response', () => {
    it('Sets status code to 200', () => {
      setExpressResponse(dummyResponse, exampleControllerOkResponse);

      expect(dummyResponse.status).to.have.been.calledOnceWithExactly(200);
    });
  });
  describe('When controller response is Error response', () => {
    describe('When errorName is InvalidRequestError', () => {
      it('Sets status code to 400', () => {
        setExpressResponse(dummyResponse, {
          ...exampleControllerErrorResponse,
          errorName: 'InvalidRequestError',
        } as ControllerResponse);

        expect(dummyResponse.status).to.have.been.calledOnceWithExactly(400);
      });
    });
    describe('When errorName is InternalError', () => {
      it('Sets status code to 500', () => {
        setExpressResponse(dummyResponse, {
          ...exampleControllerErrorResponse,
          errorName: 'InternalError',
        } as ControllerResponse);

        expect(dummyResponse.status).to.have.been.calledOnceWithExactly(500);
      });
    });
    describe('When errorName is InvalidDataError', () => {
      it('Sets status code to 400', () => {
        setExpressResponse(dummyResponse, {
          ...exampleControllerErrorResponse,
          errorName: 'InvalidDataError',
        } as ControllerResponse);

        expect(dummyResponse.status).to.have.been.calledOnceWithExactly(400);
      });
    });
    describe('When errorName is DiscrepancyError', () => {
      it('Sets status code to 500', () => {
        setExpressResponse(dummyResponse, {
          ...exampleControllerErrorResponse,
          errorName: 'DiscrepancyError',
        } as ControllerResponse);

        expect(dummyResponse.status).to.have.been.calledOnceWithExactly(500);
      });
    });
    describe('When errorName is set to unknown value', () => {
      it('Sets status code to 500', () => {
        setExpressResponse(dummyResponse, {
          ...exampleControllerErrorResponse,
          errorName: 'UnknownError',
        } as ControllerResponse);

        expect(dummyResponse.status).to.have.been.calledOnceWithExactly(500);
      });
    });
  });
});
