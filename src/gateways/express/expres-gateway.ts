import express, { Application, Request, Response } from 'express';
import { Server } from 'http';
import Controller from '../../controller/controller';
import { ActionHandler } from '../../controller/types/action-handler';
import { ControllerResponse } from '../../controller/types/controller-response';
import Gateway from '../types/gateway';
import { ArgumentExtractor } from './types/argument-extractor';
import { ExpressRouteSchema } from './types/express-route-schema';
import getStatusCodeFromError from './types/get-status-code-from-error';

export default class ExpressGateway implements Gateway {
  public readonly expressApp: Application;

  private expressServer: Server | undefined;

  constructor(schema: ExpressRouteSchema, controller: Controller) {
    this.expressApp = express();

    const addRouteForMethod = {
      GET: this.addGetRoute.bind(this),
      POST: this.addPostRoute.bind(this),
      DELETE: this.addDeleteRoute.bind(this),
      PUT: this.addPutRoute.bind(this),
    };

    schema.routes.forEach(({
      actionSignature, method, path, argumentExtractor,
    }) => {
      const actionHandler = controller.getActionHandler(actionSignature);
      addRouteForMethod[method](path, argumentExtractor, actionHandler);
    });
  }

  protected addGetRoute(
    path: string,
    argumentExtractor: ArgumentExtractor,
    handler: ActionHandler,
  ) {
    this.expressApp.get(
      path,
      this.handleHTTPRequest.bind(this, handler, argumentExtractor),
    );
  }

  protected addPostRoute(
    path: string,
    argumentExtractor: ArgumentExtractor,
    handler: ActionHandler,
  ) {
    this.expressApp.post(
      path,
      this.handleHTTPRequest.bind(this, handler, argumentExtractor),
    );
  }

  protected addPutRoute(
    path: string,
    argumentExtractor: ArgumentExtractor,
    handler: ActionHandler,
  ) {
    this.expressApp.put(
      path,
      this.handleHTTPRequest.bind(this, handler, argumentExtractor),
    );
  }

  protected addDeleteRoute(
    path: string,
    argumentExtractor: ArgumentExtractor,
    handler: ActionHandler,
  ) {
    this.expressApp.delete(
      path,
      this.handleHTTPRequest.bind(this, handler, argumentExtractor),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  public async handleHTTPRequest(
    actionHandler: ActionHandler,
    argumentExtractor: ArgumentExtractor,
    request: Request,
    response: Response,
  ): Promise<void> {
    console.log(`Handling ${request.method} request for ${request.path}`);
    const requestArgs = argumentExtractor(request);
    console.log(`Extracted args: ${requestArgs}`);
    const controllerResponse = await actionHandler({ action: 'unused', args: requestArgs });
    console.log('Preparing response');
    if (controllerResponse.isOk) this.setOkResponse(controllerResponse, response);
    else this.setErrorResponse(controllerResponse, response);
  }

  // eslint-disable-next-line class-methods-use-this
  private setOkResponse(
    controllerResponse: ControllerResponse,
    expressResponse: Response,
  ): void {
    expressResponse
      .contentType('application/json');
    expressResponse
      .status(200);
    expressResponse
      .send(JSON.stringify(controllerResponse));
  }

  // eslint-disable-next-line class-methods-use-this
  private setErrorResponse(
    controllerResponse: ControllerResponse,
    expressResponse: Response,
  ): void {
    if (controllerResponse.isOk) throw new Error('Unreachable!');
    expressResponse
      .contentType('application/json');
    expressResponse
      .status(getStatusCodeFromError(controllerResponse.error));
    expressResponse
      .send(JSON.stringify({
        isOk: false,
        errorName: controllerResponse.error.name,
        errorMessage: controllerResponse.error.message,
      }));
  }

  open(port: number, hostname = 'localhost'): Promise<void> {
    return new Promise((resolve) => {
      this.expressServer = this.expressApp.listen(port, hostname, () => {
        resolve();
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.expressServer) {
        this.expressServer.close((error) => {
          if (error) reject();
          resolve();
        });
      }
      reject();
    });
  }
}
