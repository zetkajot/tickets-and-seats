import { Response } from 'express';
import { ControllerResponse } from '../../controllers/types/controller-response';

export default function setExpressResponse(
  expressResponse: Response,
  controllerResponse: ControllerResponse,
): void {
  expressResponse.type('application/json');

  if (controllerResponse.isOk) {
    expressResponse.status(200);
  } else {
    expressResponse.status(
      getCodeFromErrorName(controllerResponse.errorName),
    );
  }

  const stringifiedResponse = JSON.stringify(controllerResponse);

  expressResponse.send(stringifiedResponse);
}

function getCodeFromErrorName(errorName: string): number {
  return codeLookup[errorName] ?? 500;
}

const codeLookup: { [k: string]: number } = {
  InvalidDataError: 400,
  DiscrepancyError: 500,
  InternalError: 500,
  InvalidRequestError: 400,
};
