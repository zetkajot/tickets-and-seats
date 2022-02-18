import { ArgumentExtractor } from './argument-extractor';

export type ExpressRouteSchema = {
  routes: {
    actionSignature: string,
    method: 'POST' | 'PUT' | 'GET' | 'DELETE',
    path: string,
    argumentExtractor: ArgumentExtractor,
  }[],
};
