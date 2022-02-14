import { Response } from 'express';
import InvalidRequestError from '../../controllers/errors/invalid-request-error';
import { ControllerResponse } from '../../controllers/types/controller-response';
import DiscrepancyError from '../../use-cases/use-case-utils/errors/discrapency-error';
import InternalError from '../../use-cases/use-case-utils/errors/internal-error';
import InvalidDataError, { InvalidDataErrorSubtype } from '../../use-cases/use-case-utils/errors/invalid-data-error';

export default function setExpressResponse(
  expressResponse: Response,
  controllerResponse: ControllerResponse,
): void {
  expressResponse.type('application/json');

  if (controllerResponse.isOk) {
    expressResponse.status(200);
  } else {
    expressResponse.status(
      getResponseCodeFromError(controllerResponse.error),
    );
  }

  const gatewayResponse = controllerResponse.isOk
    ? controllerResponse
    : transformErrorResponse(controllerResponse);

  const stringifiedResponse = JSON.stringify(gatewayResponse);

  expressResponse.send(stringifiedResponse);
}

function getResponseCodeFromError(error: Error): number {
  if (error instanceof InvalidRequestError) return 400;
  if (error instanceof DiscrepancyError) return 500;
  if (error instanceof InternalError) return 500;
  if (error instanceof InvalidDataError) {
    return invalidDataErrorSubtypesCodeLookup[error.subtype] ?? 400;
  }
  return 500;
}

const invalidDataErrorSubtypesCodeLookup: { [k in InvalidDataErrorSubtype]: number } = {
  [InvalidDataErrorSubtype.ENTITY_NOT_FOUND]: 404,
  [InvalidDataErrorSubtype.EVENT_CLOSED]: 409,
  [InvalidDataErrorSubtype.EVENT_OPENED]: 409,
  [InvalidDataErrorSubtype.INVALID_EVENT_DATA]: 422,
  [InvalidDataErrorSubtype.NOT_SPECIFIED]: 400,
  [InvalidDataErrorSubtype.INVALID_HALL_DATA]: 422,
  [InvalidDataErrorSubtype.SEAT_NOT_FOUND]: 409,
  [InvalidDataErrorSubtype.SEAT_TAKEN]: 409,
};

function transformErrorResponse(controllerResponse: ControllerResponse): {
  isOk: boolean,
  errorName: string,
  errorMessage: string,
} {
  if (controllerResponse.isOk) {
    throw new Error('Unreachable!');
  }
  return {
    isOk: false,
    errorMessage: controllerResponse.error.message,
    errorName: controllerResponse.error.name,
  };
}
