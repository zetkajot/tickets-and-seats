import { Server as HTTPServer } from 'http';
import { Server as HTTPSServer } from 'https';
import e from 'express';
import { HTTPOptions } from './types/http-options';
import { HTTPServerCreator } from './types/http-server-creator';
import { HTTPSOptions } from './types/https-options';
import { HTTPSServerCreator } from './types/https-server-creator';

export default class ExpressConnector {
  private httpServer: HTTPServer | undefined;

  private httpsServer: HTTPSServer | undefined;

  constructor(private app: e.Application) {}

  openHTTP(serverCreator: HTTPServerCreator, options: HTTPOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        reject(new Error('HTTP server already running!'));
      }
      this.httpServer = serverCreator(this.app as any);
      this.httpServer.listen(options.port ?? 0, options.host ?? '0.0.0.0')
        .on('listening', () => resolve());
    });
  }

  openHTTPS(serverCreator: HTTPSServerCreator, options: HTTPSOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpsServer) {
        reject(new Error('HTTPS server already running!'));
      }
      this.httpsServer = serverCreator({ key: options.key, cert: options.cert }, this.app);
      this.httpsServer.listen(options.port ?? 0, options.host ?? '0.0.0.0')
        .on('listening', () => resolve());
    });
  }

  closeHTTP(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.httpServer) {
        reject(new Error('HTTP server not running!'));
      }
      this.httpServer!
        .close()
        .on('close', () => resolve());
    });
  }

  closeHTTPS(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.httpsServer) {
        reject(new Error('HTTPS server not running!'));
      }
      this.httpsServer!
        .close()
        .on('close', () => resolve());
    });
  }
}
