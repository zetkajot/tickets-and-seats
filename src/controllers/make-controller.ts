import Gateway from '../gateways/types/gateway';
import UseCase from '../use-cases/use-case';
import { RequestConverter } from './request-converters/make-input-converter';
import { Actions } from './types/actions';
import { Controller } from './types/controller';
import { ControllerRequest } from './types/controller-request';
import { ControllerResponse } from './types/controller-response';

export default function makeController(
  actions: Actions,
  gateway: Gateway,
): Controller<typeof actions> {
  const returned: Controller<typeof actions> = {};
  Object.entries(actions).forEach(([actionName, { converter, useCase }]) => {
    Object.defineProperty(returned, `handle${capitalize(actionName)}`, {
      value: actionHandler.bind(returned, useCase, converter),
    });
    gateway.addPointOfInteraction(actionName, returned[`handle${capitalize(actionName)}`].bind(returned));
  });
  return returned;
}

async function actionHandler<Input, Output>(
  useCase: UseCase<Input, Output>,
  converter: RequestConverter,
  request: ControllerRequest,
): Promise<ControllerResponse> {
  try {
    const convertedInput = converter(request);
    const data = await useCase.execute(convertedInput);
    return makeOkReponse(data as unknown as object);
  } catch (error) {
    return makeErrorResponse(error as Error);
  }
}

function makeErrorResponse(error: Error): ControllerResponse {
  return {
    isOk: false,
    error,
  };
}

function makeOkReponse(data: object): ControllerResponse {
  return {
    isOk: true,
    data,
  };
}

function capitalize(text: string): string {
  return `${text[0].toLocaleUpperCase()}${text.slice(1)}`;
}
