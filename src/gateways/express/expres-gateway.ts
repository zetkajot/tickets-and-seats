import express, { Application, Request, Response } from 'express';
import { Server } from 'http';
import https from 'https';
import { join } from 'path';
import { KeyObject } from 'tls';
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

  private expressSSLServer: Server | undefined;

  constructor(schema: ExpressRouteSchema, controller: Controller) {
    this.expressApp = express();

    this.expressApp.use(express.json());
    this.expressApp.use('/', express.static(join(process.cwd(), 'static')));

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

    this.expressApp.get('*', (req, res) => {
      res.status(404).sendFile(join(process.cwd(), 'static', '404.html'));
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
    const requestArgs = argumentExtractor(request);
    const controllerResponse = await actionHandler({ action: 'unused', args: requestArgs });
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

  openSecure(
    cert: string | Buffer | (string | Buffer)[],
    key: string | Buffer | (Buffer | KeyObject)[],
    port: number,
    hostname = 'localhost',
  ): Promise<void> {
    return new Promise((resolve) => {
      this.expressSSLServer = https.createServer({
        cert, key,
      }, this.expressApp).listen(port, hostname);
      this.expressSSLServer.on('listening', () => resolve());
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
