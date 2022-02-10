import { Request, Response } from 'express';
import Controller from '../../controllers/controller';
import makeControllerRequest from './make-controller-request';
import setExpressResponse from './set-express-response';

export default async function handleRoute(
  controller: Controller,
  actionName: string,
  request: Request,
  response: Response,
) {
  const controllerRequest = makeControllerRequest(request, actionName);
  const controllerResponse = await controller.handleRequest(controllerRequest);
  setExpressResponse(response, controllerResponse);
}
