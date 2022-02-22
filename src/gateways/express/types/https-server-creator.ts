import { RequestListener } from 'http';
import { ServerOptions as HTTPSServerOptions, Server as HTTPSServer } from 'https';

export type HTTPSServerCreator = (
  options: HTTPSServerOptions,
  requestListener?: RequestListener) => HTTPSServer;
