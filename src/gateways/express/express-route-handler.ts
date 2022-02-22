import e from 'express';

export default class ExpressRouteHandler {
  constructor(private app: e.Application) {}

  public addGET(path: string, handler: e.RequestHandler) {
    this.app.get(path, handler);
  }

  public addPOST(path: string, handler: e.RequestHandler) {
    this.app.post(path, handler);
  }

  public addPUT(path: string, handler: e.RequestHandler) {
    this.app.put(path, handler);
  }

  public addDELETE(path: string, handler: e.RequestHandler) {
    this.app.delete(path, handler);
  }
}
