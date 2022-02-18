/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable class-methods-use-this */
import Sinon from 'sinon';
import { expect } from 'chai';
import { Request, Response } from 'express';
import { ExpressRouteSchema } from './types/express-route-schema';
import ExpressGateway from './expres-gateway';
import { ControllerRequestArguments } from '../../controller/types/controller-request-arguments';
import { ActionHandler } from '../../controller/types/action-handler';
import { ArgumentExtractor } from './types/argument-extractor';
import InvalidRequestError from '../../controller/errors/invalid-request-error';
import InternalError, { InternalErrorSubtype } from '../../use-cases/use-case-utils/errors/internal-error';
import InvalidDataError, { InvalidDataErrorSubtype } from '../../use-cases/use-case-utils/errors/invalid-data-error';
import { ControllerResponse } from '../../controller/types/controller-response';

const SpiedClass = class {
  public static spiedGetActionHandler = Sinon.spy();

  getActionHandler(...args: any[]) {
    SpiedClass.spiedGetActionHandler(...args);
  }
};

const OverridableExpressGateway = class extends ExpressGateway {
  static overridenAddPostRoute: any = Sinon.spy();

  static overridenAddDeleteRoute: any = Sinon.spy();

  static overridenAddGetRoute: any = Sinon.spy();

  static overridenAddPutRoute: any = Sinon.spy();

  protected addGetRoute(...args: any[]): void {
    OverridableExpressGateway.overridenAddGetRoute(...args);
  }

  protected addPostRoute(...args: any[]): void {
    OverridableExpressGateway.overridenAddPostRoute(...args);
  }

  protected addPutRoute(...args: any[]): void {
    OverridableExpressGateway.overridenAddPutRoute(...args);
  }

  protected addDeleteRoute(...args: any[]): void {
    OverridableExpressGateway.overridenAddDeleteRoute(...args);
  }
};

const exampleSchema1: ExpressRouteSchema = {
  routes: [
    {
      actionSignature: 'action1',
      method: 'DELETE',
      path: 'some/path',
      argumentExtractor: () => ({} as ControllerRequestArguments),
    }, {
      actionSignature: 'action2',
      method: 'POST',
      path: 'some/other/path',
      argumentExtractor: () => ({} as ControllerRequestArguments),
    },
  ],
};

const exampleSchema2: ExpressRouteSchema = {
  routes: [
    {
      actionSignature: 'postAction1',
      method: 'POST',
      path: 'post/action/1',
      argumentExtractor: undefined as any,
    },
    {
      actionSignature: 'postAction2',
      method: 'POST',
      path: 'post/action/2',
      argumentExtractor: undefined as any,
    },
    {
      actionSignature: 'getAction1',
      method: 'GET',
      path: 'get/action/1',
      argumentExtractor: undefined as any,
    },
    {
      actionSignature: 'getAction2',
      method: 'GET',
      path: 'get/action/2',
      argumentExtractor: undefined as any,
    },
    {
      actionSignature: 'putAction1',
      method: 'PUT',
      path: 'put/action/1',
      argumentExtractor: undefined as any,
    },
    {
      actionSignature: 'putAction2',
      method: 'PUT',
      path: 'put/action/2',
      argumentExtractor: undefined as any,
    },
    {
      actionSignature: 'deleteAction1',
      method: 'DELETE',
      path: 'delete/action/1',
      argumentExtractor: undefined as any,
    },
    {
      actionSignature: 'deleteAction2',
      method: 'DELETE',
      path: 'delete/action/2',
      argumentExtractor: undefined as any,
    },
  ],
};

describe('Express Gateway test suite', () => {
  before(() => {
    Sinon.reset();
  });
  describe('At initialization', () => {
    it('Gets action handlers for each action signature specified in route schema', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const gateway = new ExpressGateway(exampleSchema1, new SpiedClass() as any);

      expect(SpiedClass.spiedGetActionHandler).to.have.been.calledTwice;
      expect(SpiedClass.spiedGetActionHandler.args[0]).to.deep.equal(['action1']);
      expect(SpiedClass.spiedGetActionHandler.args[1]).to.deep.equal(['action2']);
    });
    describe('For each route with method set to ', () => {
      let spiedOverridenGateway: ExpressGateway;
      before(() => {
        spiedOverridenGateway = new OverridableExpressGateway(
          exampleSchema2,
          new SpiedClass() as any,
        );
      });
      describe('POST', () => {
        it('adds that route via addPostRoute', () => {
          expect(OverridableExpressGateway.overridenAddPostRoute).to.have.been.calledTwice;
          expect(OverridableExpressGateway.overridenAddPostRoute.args[0][0]).to.equal('post/action/1');
          expect(OverridableExpressGateway.overridenAddPostRoute.args[1][0]).to.equal('post/action/2');
        });
      });
      describe('PUT', () => {
        it('adds that route via addPutRoute', () => {
          expect(OverridableExpressGateway.overridenAddPutRoute).to.have.been.calledTwice;
          expect(OverridableExpressGateway.overridenAddPutRoute.args[0][0]).to.equal('put/action/1');
          expect(OverridableExpressGateway.overridenAddPutRoute.args[1][0]).to.equal('put/action/2');
        });
      });
      describe('DELETE', () => {
        it('adds that route via addDeleteRoute', () => {
          expect(OverridableExpressGateway.overridenAddDeleteRoute).to.have.been.calledTwice;
          expect(OverridableExpressGateway.overridenAddDeleteRoute.args[0][0]).to.equal('delete/action/1');
          expect(OverridableExpressGateway.overridenAddDeleteRoute.args[1][0]).to.equal('delete/action/2');
        });
      });
      describe('GET', () => {
        it('adds that route via addGetRoute', () => {
          expect(OverridableExpressGateway.overridenAddGetRoute).to.have.been.calledTwice;
          expect(OverridableExpressGateway.overridenAddGetRoute.args[0][0]).to.equal('get/action/1');
          expect(OverridableExpressGateway.overridenAddGetRoute.args[1][0]).to.equal('get/action/2');
        });
      });
    });
  });
  describe('When handling HTTP request', () => {
    const spiedHandler = Sinon.spy(
      async () => ({ isOk: true, data: { ok: true } } as ControllerResponse),
    );
    const spiedExtractor = Sinon.spy(() => dummyArgs);
    const dummyExpressRequest = { whoAmI: 'a dummy' } as unknown as Request;
    const spiedExpressResponse = {
      send: Sinon.spy(),
      contentType: Sinon.spy(),
      status: Sinon.spy(),
    } as unknown as Response;
    const dummyArgs = { args: [] } as unknown as ControllerRequestArguments;
    const gateway = new ExpressGateway(exampleSchema1, new SpiedClass() as any);
    before(async () => {
      await gateway.handleHTTPRequest(
        spiedHandler,
        spiedExtractor,
        dummyExpressRequest,
        spiedExpressResponse,
      );
    });
    it('Uses given argument extractor to obtain controller request arguments from express request', () => {
      expect(spiedExtractor).to.have.been.calledOnceWithExactly(dummyExpressRequest);
    });
    it('Calls given action handler with controller request built from extracted arguments', () => {
      expect(spiedHandler).to.have.been.calledWithMatch({ args: dummyArgs });
    });
    describe('When handler returns ok response', () => {
      before(async () => {
        Sinon.reset();
        const okReturningHandler = async () => (
          { isOk: true, data: { ok: true } } as ControllerResponse
        );
        await gateway.handleHTTPRequest(
          okReturningHandler,
          spiedExtractor,
          dummyExpressRequest,
          spiedExpressResponse,
        );
      });
      it('Sets content-type header to application/json', () => {
        expect(spiedExpressResponse.contentType)
          .to.have.been.calledOnceWithExactly('application/json');
      });
      it('Sets response code to 200', () => {
        expect(spiedExpressResponse.status)
          .to.have.been.calledOnceWithExactly(200);
      });
      it('Sends stringified response acquired from handler with no changes', () => {
        expect(spiedExpressResponse.send)
          .to.have.been.calledOnceWithExactly(JSON.stringify({ isOk: true, data: { ok: true } }));
      });
    });
    describe('When handler returns error response', () => {
      const handleRequestWithError = handleErronousHTTPRequest.bind(
        null,
        spiedExtractor,
        dummyExpressRequest,
        spiedExpressResponse,
        gateway,
      );
      before(async () => {
        Sinon.reset();
        await handleRequestWithError(new Error('some-msg'));
      });
      it('Sets content-type header to application/json', () => {
        expect(spiedExpressResponse.contentType)
          .to.have.been.calledOnceWithExactly('application/json');
      });
      it('Sends stringified response acquired from handler with error name and message', () => {
        expect(spiedExpressResponse.send)
          .to.have.been.calledOnceWithExactly(
            JSON.stringify({ isOk: false, errorName: 'Error', errorMessage: 'some-msg' }),
          );
      });
      describe('When error in handler\'s response is', () => {
        beforeEach(() => {
          Sinon.reset();
        });
        describe('InvalidRequestError', () => {
          it('Sets response code to 400', async () => {
            await handleRequestWithError(new InvalidRequestError());
            expect(spiedExpressResponse.status)
              .to.have.been.calledOnceWithExactly(400);
          });
        });
        describe('InternalError no matter the subtype', () => {
          it('Sets response code to 500', async () => {
            await handleRequestWithError(
              new InternalError(InternalErrorSubtype.UNKNOWN_ERROR, new Error()),
            );
            expect(spiedExpressResponse.status)
              .to.have.been.calledOnceWithExactly(500);
          });
        });
        describe('InvalidDataError with subtype set to', () => {
          describe('ENTITY_NOT_FOUND', () => {
            it('Sets response code to 404', async () => {
              await handleRequestWithError(
                new InvalidDataError(InvalidDataErrorSubtype.ENTITY_NOT_FOUND),
              );
              expect(spiedExpressResponse.status)
                .to.have.been.calledOnceWithExactly(404);
            });
          });
          describe('INVALID_HALL_DATA', () => {
            it('Sets response code to 422', async () => {
              await handleRequestWithError(
                new InvalidDataError(InvalidDataErrorSubtype.INVALID_HALL_DATA),
              );
              expect(spiedExpressResponse.status)
                .to.have.been.calledOnceWithExactly(422);
            });
          });
          describe('EVENT_CLOSED', () => {
            it('Sets response code to 409', async () => {
              await handleRequestWithError(
                new InvalidDataError(InvalidDataErrorSubtype.EVENT_CLOSED),
              );
              expect(spiedExpressResponse.status)
                .to.have.been.calledOnceWithExactly(409);
            });
          });
          describe('EVENT_OPENED', () => {
            it('Sets response code to 409', async () => {
              await handleRequestWithError(
                new InvalidDataError(InvalidDataErrorSubtype.EVENT_OPENED),
              );
              expect(spiedExpressResponse.status)
                .to.have.been.calledOnceWithExactly(409);
            });
          });
          describe('INVALID_EVENT_DATA', () => {
            it('Sets response code to 422', async () => {
              await handleRequestWithError(
                new InvalidDataError(InvalidDataErrorSubtype.INVALID_EVENT_DATA),
              );
              expect(spiedExpressResponse.status)
                .to.have.been.calledOnceWithExactly(422);
            });
          });
          describe('SEAT_TAKEN', () => {
            it('Sets response code to 409', async () => {
              await handleRequestWithError(
                new InvalidDataError(InvalidDataErrorSubtype.SEAT_TAKEN),
              );
              expect(spiedExpressResponse.status)
                .to.have.been.calledOnceWithExactly(409);
            });
          });
          describe('SEAT_NOT_FOUND', () => {
            it('Sets response code to 409', async () => {
              await handleRequestWithError(
                new InvalidDataError(InvalidDataErrorSubtype.SEAT_NOT_FOUND),
              );
              expect(spiedExpressResponse.status)
                .to.have.been.calledOnceWithExactly(409);
            });
          });
          describe('NOT_SPECIFIED', () => {
            it('Sets response code to 400', async () => {
              await handleRequestWithError(
                new InvalidDataError(InvalidDataErrorSubtype.NOT_SPECIFIED),
              );
              expect(spiedExpressResponse.status)
                .to.have.been.calledOnceWithExactly(400);
            });
          });
        });
      });
    });
  });
});

function makeThrowingHandler(error: Error): ActionHandler {
  return async () => ({ isOk: false, error });
}

async function handleErronousHTTPRequest(
  spiedExtractor: ArgumentExtractor,
  dummyExpressRequest: Request,
  spiedExpressResponse: Response,
  gateway: ExpressGateway,
  errorType: Error,
) {
  await gateway.handleHTTPRequest(
    makeThrowingHandler(errorType),
    spiedExtractor,
    dummyExpressRequest,
    spiedExpressResponse,
  );
}
