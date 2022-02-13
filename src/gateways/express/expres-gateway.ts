import express from 'express';
import { ControllerRequest } from '../../controllers/types/controller-request';
import { ControllerResponse } from '../../controllers/types/controller-response';
import Gateway from '../types/gateway';
import makeControllerRequest from './make-controller-request';
import { RouteMapper } from './types/route-mapper';
import setExpressResponse from './set-express-response';
import { RouteHandler } from './types/route-handler';

export default class ExpressGateway implements Gateway {
  public expressApp: express.Express;

  constructor(private routeMapper: RouteMapper) {
    this.expressApp = express();
  }

  addPointOfInteraction(
    actionName: string,
    actionHandler: (req: ControllerRequest) => Promise<ControllerResponse>,
  ): void {
    const { method, path } = this.routeMapper(actionName);

    const handler = async (req: express.Request, res: express.Response) => {
      const controllerRequest = makeControllerRequest(req, actionName);
      const controllerResponse = await actionHandler(controllerRequest);
      setExpressResponse(res, controllerResponse);
    };

    // eslint-disable-next-line default-case
    switch (method) {
      case 'PUT':
        this.addPutRoute(path, handler);
        break;
      case 'DELETE':
        this.addDeleteRoute(path, handler);
        break;
      case 'POST':
        this.addPostRoute(path, handler);
        break;
      case 'GET':
        this.addGetRoute(path, handler);
        break;
      default:
        throw new Error(`Method ${method} is not supported!`);
        break;
    }
  }

  public addGetRoute(path: string, routeHandler: RouteHandler): void {
    this.expressApp.get(path, routeHandler);
  }

  public addPostRoute(path: string, routeHandler: RouteHandler): void {
    this.expressApp.post(path, routeHandler);
  }

  public addDeleteRoute(path: string, routeHandler: RouteHandler): void {
    this.expressApp.delete(path, routeHandler);
  }

  public addPutRoute(path: string, routeHandler: RouteHandler): void {
    this.expressApp.put(path, routeHandler);
  }
}
