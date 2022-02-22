import { readFile } from 'fs/promises';
import { createServer as createHttpsServer } from 'https';
import { createServer as createHttpServer } from 'http';
import path from 'path';
import Controller from './controller/controller';
import parseSchema from './controller/schema-parser/parse-schema';
import ErrorFactory from './error/error-factory';
import ExpressGateway from './gateways/express/expres-gateway';
import makeExpressGateway from './gateways/express/make-express-gateway';
import MariaDBConnector from './infrastracture/concrete/mariadb/mariadb-connector';
import MariaDBStorageVendor from './infrastracture/concrete/mariadb/mariadb-storage-vendor';
import utilityQueries from './infrastracture/concrete/mariadb/utils/utility-queries';
import CombinedStorageVendor from './infrastracture/storage-vendors/combined-storage-vendor';
import ConfigSingleton from './utils/config-singleton';

const { mariadbConfig, expressConfig } = ConfigSingleton.getConfig();

export default class AppManager {
  private connector: MariaDBConnector;

  private gateway: ExpressGateway | undefined;

  constructor() {
    ErrorFactory.setDefaultLogger();
    this.connector = new MariaDBConnector(mariadbConfig);
    this.bindSIGINT();
  }

  private bindSIGINT() {
    process.once('SIGINT', async () => { await this.stop(); });
  }

  async start() {
    const sv = await this.setupStorageVendor();
    const controller = this.setupController(sv);
    await this.setupGateway(controller);
    await this.startGateway();
  }

  private async setupStorageVendor() {
    await this.connector.start(utilityQueries.InitializeTables);
    return new MariaDBStorageVendor(this.connector);
  }

  // eslint-disable-next-line class-methods-use-this
  private setupController(storageVendor: CombinedStorageVendor): Controller {
    const controllerSchema = parseSchema(path.join(__dirname, `..${path.sep}`, 'schemas', 'controller_schema.json'));
    return new Controller(storageVendor, controllerSchema);
  }

  private async setupGateway(controller: Controller) {
    const routeSchemaPath = path.join(__dirname, `..${path.sep}`, 'schemas', 'route_schema.json');
    this.gateway = makeExpressGateway(controller, routeSchemaPath);
  }

  private async startGateway() {
    if (expressConfig.sslPort) {
      const { key, cert } = await this.loadKeyAndCert();
      this.gateway!.connector.openHTTPS(createHttpsServer, {cert, key, port: expressConfig.sslPort});
    }
    const port = +<string>process.env.PORT || expressConfig.port || 0;
    await this.gateway!.connector.openHTTP(createHttpServer as any, {port, host: '0.0.0.0'});
  }

  // eslint-disable-next-line class-methods-use-this
  private async loadKeyAndCert() {
    const cert = await readFile(path.join(__dirname, `..${path.sep}`, 'ssl', 'certificate.crt'));
    const key = await readFile(path.join(__dirname, `..${path.sep}`, 'ssl', 'private.key'));
    return { key, cert };
  }

  async stop() {
    try {
      await this.gateway?.connector.closeHTTP();
      await this.gateway?.connector.closeHTTPS();
      await this.connector.stop();
    } catch {
      console.log('Error occured while stopping the server!');
    }
  }
}
