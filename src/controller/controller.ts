import CombinedStorageVendor from '../infrastracture/storage-vendors/combined-storage-vendor';
import UseCase from '../use-cases/use-case';
import { ActionHandler } from './types/action-handler';
import convertRequestArguments from './argument-converters/convert-request-arguments';
import { ConversionResult } from './argument-converters/types/conversion-result';
import InvalidRequestError from './errors/invalid-request-error';
import { ControllerRequest } from './types/controller-request';
import { ControllerRequestArguments } from './types/controller-request-arguments';
import { ControllerResponse } from './types/controller-response';
import { ControllerSchema } from './types/controller-schema';

type BoundConverter = (requestArgs: ControllerRequestArguments) => ConversionResult;
type StoredAction = {
  useCase: UseCase<any, any>,
  converter: BoundConverter,
};

export default class Controller {
  private actions: Map<string, StoredAction> = new Map();

  constructor(storageVendor: CombinedStorageVendor, schema: ControllerSchema) {
    Object.entries(schema.actions).forEach(([signature, settings]) => {
      const UseCaseCtr = settings['use-case'];
      const inputSchema = settings['input-schema'];
      this.actions.set(signature, {
        useCase: new UseCaseCtr(storageVendor),
        converter: convertRequestArguments.bind(null, inputSchema),
      });
    });
  }

  public getActionHandler(actionSignature: string): ActionHandler {
    if (!this.actions.has(actionSignature)) {
      throw new Error('Action does not exist!');
    }
    return this.handleAction.bind(this, actionSignature);
  }

  private async handleAction(
    actionSignature: string,
    request: ControllerRequest,
  ): Promise<ControllerResponse> {
    const { useCase, converter } = this.actions.get(actionSignature) as StoredAction;
    try {
      const useCaseInput = Controller.prepareUseCaseInput(converter, request);
      const useCaseOutput = await useCase.execute(useCaseInput);
      return Controller.makeOkResponse(useCaseOutput);
    } catch (error) {
      return Controller.makeErrorResponse(error as Error);
    }
  }

  private static prepareUseCaseInput(
    converter: BoundConverter,
    request: ControllerRequest,
  ): unknown {
    const conversionResult = converter(request.args);
    if (conversionResult.wasSuccessful) {
      return conversionResult.convertedData;
    }
    throw new InvalidRequestError();
  }

  private static makeOkResponse(data: any): ControllerResponse {
    return {
      isOk: true,
      data,
    };
  }

  private static makeErrorResponse(error: Error): ControllerResponse {
    return {
      isOk: false,
      error,
    };
  }
}
