import ErrorFactory from '../error/error-factory';
import CombinedStorageVendor from '../infrastracture/storage-vendors/combined-storage-vendor';
import UseCase from '../use-cases/use-case';
import InvalidRequestError from './errors/invalid-request-error';
import InvalidSchemaError from './errors/invalid-schema-error';
import { ActionSchema } from './types/action-schema';
import { ControllerRequest } from './types/controller-request';
import { ControllerResponse } from './types/controller-response';

export default class Controller {
  private internalSchema: Map<string, { usecase: UseCase<any, any>, converter: any }>;

  constructor(actionSchema: ActionSchema, protected dataVendor: CombinedStorageVendor) {
    if (actionSchema.length < 1) {
      throw ErrorFactory.getInstance().makeError(InvalidSchemaError);
    }
    this.internalSchema = new Map();
    this.convertToInternalSchema(actionSchema);
  }

  private convertToInternalSchema(actionSchema: ActionSchema): void {
    actionSchema.forEach(({ actionName, convertRequestToInput, targetUseCase }) => {
      if (this.internalSchema.has(actionName)) {
        throw ErrorFactory.getInstance().makeError(InvalidSchemaError);
      }
      // eslint-disable-next-line new-cap
      const usecase = new targetUseCase(this.dataVendor);
      this.internalSchema.set(actionName, { usecase, converter: convertRequestToInput });
    });
  }

  async handleRequest(request: ControllerRequest): Promise<ControllerResponse> {
    try {
      const { usecase, converter } = this.getUseCaseConverterPair(request.action);
      const usecaseInput = converter(request);
      const response = await usecase.execute(usecaseInput);
      return {
        isOk: true,
        data: response,
      };
    } catch (error) {
      return {
        isOk: false,
        errorName: (error as Error).name,
        errorMessage: (error as Error).message,
      };
    }
  }

  private getUseCaseConverterPair(actionName: string) {
    if (this.internalSchema.has(actionName)) {
      return this.internalSchema.get(actionName) as { usecase: UseCase<any, any>, converter: any };
    }
    throw ErrorFactory.getInstance().makeError(InvalidRequestError);
  }
}
