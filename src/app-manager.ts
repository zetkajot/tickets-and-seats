import { createServer as createHttpsServer } from 'https';
import { createServer as createHttpServer } from 'http';
import { readFile } from 'fs/promises';
import Controller from './controller/controller';
import parseSchema from './controller/schema-parser/parse-schema';
import ExpressGateway from './gateways/express/expres-gateway';
import makeExpressGateway from './gateways/express/make-express-gateway';
import MariaDBConnector from './infrastracture/concrete/mariadb/mariadb-connector';
import MariaDBStorageVendor from './infrastracture/concrete/mariadb/mariadb-storage-vendor';
import ConfigSingleton from './utils/config-singleton';
import utilityQueries from './infrastracture/concrete/mariadb/utils/utility-queries';

const { expressConfig, mariadbConfig } = ConfigSingleton.getConfig();
type AppManagerSettings = {
  pathToControllerSchema: string,
  pathToRouteSchema: string,
  pathToCert?: string,
  pathToKey?: string,
};
export default class AppManager {
  private mariaDBConnector: MariaDBConnector;

  private gateway: ExpressGateway | undefined;

  private wasHttpsStarted: boolean = false;

  constructor(private settings: AppManagerSettings) {
    this.mariaDBConnector = new MariaDBConnector(mariadbConfig);
    process.once('SIGINT', this.stop.bind(this));
  }

  async start(): Promise<void> {
    await this.mariaDBConnector.start(utilityQueries.InitializeTables);
    const sv = new MariaDBStorageVendor(this.mariaDBConnector);
    const controller = new Controller(sv, parseSchema(this.settings.pathToControllerSchema));
    this.gateway = makeExpressGateway(controller, this.settings.pathToRouteSchema);

    await this.gateway.connector.openHTTP(
      createHttpServer as any,
      { port: +(process.env.PORT!) || expressConfig.port || 0 },
    );

    if (expressConfig.sslPort && this.settings.pathToKey && this.settings.pathToCert) {
      const cert = await readFile(this.settings.pathToCert);
      const key = await readFile(this.settings.pathToKey);

      await this.gateway.connector.openHTTPS(
        createHttpsServer as any,
        { port: expressConfig.sslPort, cert, key },
      );
      this.wasHttpsStarted = true;
    }
  }

  async stop(): Promise<void> {
    await this.mariaDBConnector.stop();

    await this.gateway?.connector.closeHTTP();
    if (this.wasHttpsStarted) {
      await this.gateway?.connector.closeHTTPS();
    }
  }
}
