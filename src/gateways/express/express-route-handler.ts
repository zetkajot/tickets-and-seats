import e from 'express';

export default class ExpressRouteHandler {
  constructor(private app: e.Application) {}

  public addRoute(
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    path: string,
    handler: e.RequestHandler,
  ) {
    const routeAdder = {
      GET: this.app.get.bind(this, path, handler as any),
      POST: this.app.post.bind(this, path, handler as any),
      PUT: this.app.put.bind(this, path, handler as any),
      DELETE: this.app.delete.bind(this, path, handler as any),
    }[method] ?? (() => { throw new Error('Unknown method!'); });
    routeAdder();
  }
}
