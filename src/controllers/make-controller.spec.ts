/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import Sinon, { SinonSpy } from 'sinon';
import Gateway from '../gateways/types/gateway';
import UseCase from '../use-cases/use-case';
import { Actions } from './types/actions';
import makeController from './make-controller';
import { RequestConverter } from './request-converters/make-input-converter';
import { ControllerRequest } from './types/controller-request';

const dummyConverter: RequestConverter = () => ({ arg1: 'argu', arg2: 'ment' });

const dummyUseCase = {
  execute: async () => ({ output: 'some output' }),
} as unknown as UseCase<any, any>;

const dummyRequest: ControllerRequest = {
  action: 'action1',
  args: [
    {
      name: 'arg1',
      value: 'some-value',
    },
  ],
};

const dummyActions: Actions = {
  action1: {
    converter: dummyConverter,
    useCase: dummyUseCase,
  },
  action2: {
    converter: dummyConverter,
    useCase: dummyUseCase,
  },
};

const dummyGateway: Gateway = {
  addPointOfInteraction: () => undefined,
};

describe('New Controller test suite', () => {
  describe('On instantiation', () => {
    it('Adds handle method for each given action', () => {
      const madeController = makeController(dummyActions, dummyGateway);

      expect(madeController)
        .to.have.property('handleAction1');
      expect(madeController)
        .to.have.property('handleAction2');
    });
    it('Adds Point of Interaction to gateway for each given action', () => {
      const spiedGateway = {
        addPointOfInteraction: Sinon.spy(() => undefined),
      } as Gateway;

      makeController(dummyActions, spiedGateway);

      expect(spiedGateway.addPointOfInteraction).to.have.been.calledWith('action1');
      expect(spiedGateway.addPointOfInteraction).to.have.been.calledWith('action2');
    });
  });
  describe('On any handle method call', () => {
    it('Converts request into use case input data', async () => {
      const dummyActionsWithSpiedConverter: Actions = {
        ...dummyActions,
        action1: {
          converter: Sinon.spy(),
          useCase: dummyUseCase,
        },
      };
      const madeController = makeController(dummyActionsWithSpiedConverter, dummyGateway);
      await madeController.handleAction1(dummyRequest);

      expect(dummyActionsWithSpiedConverter.action1.converter)
        .to.have.been.calledOnce;
      expect((dummyActionsWithSpiedConverter.action1.converter as SinonSpy).args[0])
        .to.deep.include(dummyRequest);
    });
    it('Executes use case with converted input data', async () => {
      const dummyActionsWithSpiedUseCase: Actions = {
        ...dummyActions,
        action1: {
          converter: dummyConverter,
          useCase: { execute: Sinon.spy(async () => undefined) } as unknown as UseCase<any, any>,
        },
      };
      const madeController = makeController(dummyActionsWithSpiedUseCase, dummyGateway);
      await madeController.handleAction1(dummyRequest);

      expect(dummyActionsWithSpiedUseCase.action1.useCase.execute)
        .to.have.been.calledOnce;
      expect((dummyActionsWithSpiedUseCase.action1.useCase.execute as SinonSpy).args[0])
        .to.deep.include({ arg1: 'argu', arg2: 'ment' });
    });
    describe('When no error occurs', () => {
      it('Returns ok response', async () => {
        const madeController = makeController(dummyActions, dummyGateway);

        const response = await madeController.handleAction1(dummyRequest);

        expect(response).to.deep.equal({
          isOk: true,
          data: {
            output: 'some output',
          },
        });
      });
    });
    describe('When error occurs', () => {
      it('Returns error response', async () => {
        const thrownError = new Error('Converter error');
        const dummyActionsWithThrowingConverter: Actions = {
          ...dummyActions,
          action1: {
            converter: () => { throw thrownError; },
            useCase: dummyUseCase,
          },
        };
        const madeController = makeController(dummyActionsWithThrowingConverter, dummyGateway);

        const response = await madeController.handleAction1(dummyRequest);

        expect(response).to.deep.equal({
          isOk: false,
          error: thrownError,
        });
      });
    });
  });
});
