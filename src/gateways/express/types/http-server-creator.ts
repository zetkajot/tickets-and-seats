import {
  ServerOptions as RequestListener, Server as HTTPServer,
} from 'http';

export type HTTPServerCreator = (
  requestListener?: RequestListener) => HTTPServer;
