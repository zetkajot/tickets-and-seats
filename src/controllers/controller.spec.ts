/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable class-methods-use-this */
import { expect } from 'chai';
import Sinon from 'sinon';
import CombinedStorageVendor from '../infrastracture/storage-vendors/combined-storage-vendor';
import UseCase from '../use-cases/use-case';
import InvalidRequestError from './errors/invalid-request-error';
import InvalidSchemaError from './errors/invalid-schema-error';
import { ActionSchema, UseCaseConstructor } from './types/action-schema';
import Controller from './controller';
import { ControllerRequest } from './types/controller-request';

const dummyUseCaseConstructor = class extends UseCase<any, any> {
  async execute(input: any): Promise<any> {
    throw new Error('Unimplemented!');
  }
};

describe('Controller test suite', () => {
  describe('Instantiation', () => {
    describe('When provided with empty Schema', () => {
      it('Throws InvalidSchemaError', () => {
        const emptySchema = [] as ActionSchema;

        const tryInitializing = () => new Controller(emptySchema, {} as CombinedStorageVendor);

        expect(tryInitializing).to.throw(InvalidSchemaError);
      });
    });
    describe('When provided with schema with duplicate action names', () => {
      it('Throws InvalidSchemaError', () => {
        const schemaWithDuplicateNames: ActionSchema = [
          {
            actionName: 'some name',
            convertRequestToInput: <any>(() => undefined),
            targetUseCase: dummyUseCaseConstructor,
          },
          {
            actionName: 'some name',
            convertRequestToInput: <any>(() => undefined),
            targetUseCase: dummyUseCaseConstructor,
          },
        ];

        const tryInitializing = () => new Controller(
          schemaWithDuplicateNames,
          {} as CombinedStorageVendor,
        );

        expect(tryInitializing).to.throw(InvalidSchemaError);
      });
    });
    describe('When provided with valid schema', () => {
      it('Instantiates usecases with given data vendor', () => {
        let wasConstructorCalled = false;
        let usedDataVendor;
        const spiedUseCaseConstructor = class extends UseCase<any, any> {
          constructor(dataVendor: CombinedStorageVendor) {
            super(dataVendor);
            wasConstructorCalled = true;
            usedDataVendor = dataVendor;
          }

          async execute(input: any): Promise<any> {
            return '';
          }
        };
        const validSchema: ActionSchema = [
          {
            actionName: 'some name',
            convertRequestToInput: <any>(() => undefined),
            targetUseCase: spiedUseCaseConstructor,
          },
        ];
        const definetelyNotAStorage = {} as CombinedStorageVendor;
        const controller = new Controller(validSchema, definetelyNotAStorage);

        expect(wasConstructorCalled).to.equal(true);
        expect(usedDataVendor).to.equal(definetelyNotAStorage);
      });
      it('Returns new instance of Controller', () => {
        const validSchema: ActionSchema = [
          {
            actionName: 'some name',
            convertRequestToInput: <any>(() => undefined),
            targetUseCase: dummyUseCaseConstructor,
          },
        ];

        const output = new Controller(validSchema, {} as CombinedStorageVendor);

        expect(output).to.be.an.instanceOf(Controller);
      });
    });
  });
  describe('handleRequest method', () => {
    describe('When given request contains unknown action name', () => {
      it('Returns Error controller response', async () => {
        const validSchema: ActionSchema = [
          {
            actionName: 'some name',
            convertRequestToInput: <any>(() => undefined),
            targetUseCase: dummyUseCaseConstructor,
          },
        ];
        const controller = new Controller(validSchema, {} as CombinedStorageVendor);
        const result = await controller.handleRequest({
          action: 'non-existent-action',
          args: [],
        });

        expect(result).to.deep.equal({
          isOk: false,
          errorName: 'InvalidRequestError',
          errorMessage: '',
        });
      });
    });
    describe('When given request contains known action name', () => {
      it('Converts request args to use case input', async () => {
        const validSchema: ActionSchema = [
          {
            actionName: 'some name',
            convertRequestToInput: <any>Sinon.spy(),
            targetUseCase: dummyUseCaseConstructor,
          },
        ];
        const controller = new Controller(validSchema, {} as CombinedStorageVendor);
        await controller.handleRequest({ action: 'some name', args: [] });

        expect(validSchema[0].convertRequestToInput).to.have.been.calledOnce;
      });
      it('Calls execute() method on use case', async () => {
        let wasExecuteCalled;
        const susUseCaseConstructor = class extends UseCase<any, any> {
          async execute(input: any): Promise<any> {
            wasExecuteCalled = true;
            return '';
          }
        };
        const validSchema: ActionSchema = [
          {
            actionName: 'some name',
            convertRequestToInput: <any>Sinon.spy(),
            targetUseCase: susUseCaseConstructor,
          },
        ];
        const controller = new Controller(validSchema, {} as CombinedStorageVendor);
        await controller.handleRequest({ action: 'some name', args: [] });

        expect(wasExecuteCalled).to.equal(true);
      });
      describe('When error occurs during use case execution', () => {
        it('Returns error response', async () => {
          const susUseCaseConstructor = class extends UseCase<any, any> {
            async execute(input: any): Promise<any> {
              throw new Error('some msg');
            }
          };
          const validSchema: ActionSchema = [
            {
              actionName: 'some name',
              convertRequestToInput: <any>Sinon.spy(),
              targetUseCase: susUseCaseConstructor,
            },
          ];
          const controller = new Controller(validSchema, {} as CombinedStorageVendor);
          const response = await controller.handleRequest({ action: 'some name', args: [] });

          expect(response).to.deep.equal({
            isOk: false,
            errorName: 'Error',
            errorMessage: 'some msg',
          });
        });
      });
      describe('When no error occurs during use case execution', () => {
        it('Returns ok response with data returned by use case', async () => {
          const susUseCaseConstructor = class extends UseCase<any, any> {
            async execute(input: any): Promise<any> {
              return {
                data1: 'some',
                data2: 'data',
              };
            }
          };
          const validSchema: ActionSchema = [
            {
              actionName: 'some name',
              convertRequestToInput: <any>Sinon.spy(),
              targetUseCase: susUseCaseConstructor,
            },
          ];
          const controller = new Controller(validSchema, {} as CombinedStorageVendor);
          const response = await controller.handleRequest({ action: 'some name', args: [] });

          expect(response).to.deep.equal({
            isOk: true,
            data: {
              data1: 'some',
              data2: 'data',
            },
          });
        });
      });
    });
  });
});
