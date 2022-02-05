import express from 'express';
import Controller from '../../controllers/controller';
import makeControllerRequest from './make-controller-request';
import setExpressResponse from './set-express-response';

export default function makeApp(controller: Controller, actionPaths: string[]) {
  const app = express();
  actionPaths.forEach((path) => {
    console.log(`Adding GET path for /${path}`);
    app.get(`/${path}`, async (req, res) => {
      const controllerRequest = makeControllerRequest(req);
      const controllerResponse = await controller.handleRequest(controllerRequest);
      setExpressResponse(res, controllerResponse);
    });
  });

  return app;
}
