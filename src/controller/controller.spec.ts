/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Sinon from 'sinon';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import { ControllerSchema } from './types/controller-schema';
import { UseCaseConstructor } from './types/use-case-constructor';
import Controller from './controller';
import CombinedStorageVendor from '../infrastracture/storage-vendors/combined-storage-vendor';
import { ControllerRequest } from './types/controller-request';
import InvalidRequestError from './errors/invalid-request-error';

use(chaiAsPromised);
use(sinonChai);

const SpiedClass = class {
  public static constructorSpy = Sinon.spy();

  public static overridableExecute: () => Promise<any> = async () => {};

  constructor(...args: any[]) {
    SpiedClass.constructorSpy(...args);
  }

  // eslint-disable-next-line class-methods-use-this
  async execute() {
    const result = await SpiedClass.overridableExecute();
    return result;
  }
};

describe('Controller test suite', () => {
  beforeEach(() => {
    Sinon.reset();
  });
  describe('At construction', () => {
    it('Initializes every use case given in schema', () => {
      const notAStorageVendor = {} as CombinedStorageVendor;
      const schema: ControllerSchema = {
        actions: {
          'my-action': {
            'use-case': SpiedClass as unknown as UseCaseConstructor<any, any>,
            'input-schema': [],
          },
        },
      };
      const controller = new Controller(notAStorageVendor, schema);
      expect(SpiedClass.constructorSpy)
        .to.have.been.called.calledOnceWithExactly(notAStorageVendor);
    });
  });
  describe('At action handling', () => {
    describe('When error occurs during the process', () => {
      describe('while preparing use case input', () => {
        it('Returns error response indicating InvalidRequestError', async () => {
          const notAStorageVendor = {} as CombinedStorageVendor;
          const schema: ControllerSchema = {
            actions: {
              'my-action': {
                'use-case': SpiedClass as unknown as UseCaseConstructor<any, any>,
                'input-schema': [
                  {
                    argName: 'required-arg',
                  },
                ],
              },
            },
          };
          const controller = new Controller(notAStorageVendor, schema);
          const requestWithMissingArg: ControllerRequest = {
            action: 'some-action',
            args: [],
          };
          const actionHandler = controller.getActionHandler('my-action');

          const response = await actionHandler(
            requestWithMissingArg,
          ) as { isOk: boolean, error: Error };

          expect(response.isOk).to.be.false;
          expect(response.error).to.be.an.instanceOf(InvalidRequestError);
        });
      });
      describe('while executing use case', () => {
        it('Returns error response indicating whathever error was caugt', async () => {
          const notAStorageVendor = {} as CombinedStorageVendor;
          const thrownError = new SyntaxError();
          SpiedClass.overridableExecute = async () => { throw thrownError; };
          const schema: ControllerSchema = {
            actions: {
              'my-action': {
                'use-case': SpiedClass as unknown as UseCaseConstructor<any, any>,
                'input-schema': [],
              },
            },
          };
          const controller = new Controller(notAStorageVendor, schema);
          const someRequest: ControllerRequest = {
            action: 'some-action',
            args: [],
          };
          const actionHandler = controller.getActionHandler('my-action');

          const response = await actionHandler(someRequest);

          expect(response).to.deep.equal({
            isOk: false,
            error: thrownError,
          });
        });
      });
    });
    describe('When no error occurs', () => {
      it('Returns ok response with output from the use case execution', async () => {
        SpiedClass.overridableExecute = async () => 'ok';
        const notAStorageVendor = {} as CombinedStorageVendor;
        const schema: ControllerSchema = {
          actions: {
            'my-action': {
              'use-case': SpiedClass as unknown as UseCaseConstructor<any, any>,
              'input-schema': [],
            },
          },
        };
        const controller = new Controller(notAStorageVendor, schema);
        const validRequest: ControllerRequest = {
          action: 'some-action',
          args: [],
        };
        const actionHandler = controller.getActionHandler('my-action');

        const response = await actionHandler(validRequest);

        expect(response).to.deep.equal({
          isOk: true,
          data: 'ok',
        });
      });
    });
  });
  describe('When getting action handler for', () => {
    describe('for existing action', () => {
      it('Returns an action handler', () => {
        const notAStorageVendor = {} as CombinedStorageVendor;
        const schema: ControllerSchema = {
          actions: {
            'my-action': {
              'use-case': SpiedClass as unknown as UseCaseConstructor<any, any>,
              'input-schema': [],
            },
          },
        };
        const controller = new Controller(notAStorageVendor, schema);
        const actionHandler = controller.getActionHandler('my-action');
        expect(actionHandler).to.be.a('function');
      });
    });
    describe('for nonexistent action', () => {
      it('Throws an error', () => {
        const notAStorageVendor = {} as CombinedStorageVendor;
        const schema: ControllerSchema = {
          actions: {
            'my-action': {
              'use-case': SpiedClass as unknown as UseCaseConstructor<any, any>,
              'input-schema': [],
            },
          },
        };
        const controller = new Controller(notAStorageVendor, schema);
        const tryGettingActionHandler = () => controller.getActionHandler('not-an-action');
        expect(tryGettingActionHandler).to.throw('Action does not exist!');
      });
    });
  });
});
