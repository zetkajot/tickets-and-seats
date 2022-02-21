import path from 'path';
import Controller from './controller/controller';
import parseSchema from './controller/schema-parser/parse-schema';
import ErrorFactory from './error/error-factory';
import ExpressGateway from './gateways/express/expres-gateway';
import parseRouteSchema from './gateways/express/parse-route-schema';
import MariaDBConnector from './infrastracture/concrete/mariadb/mariadb-connector';
import MariaDBStorageVendor from './infrastracture/concrete/mariadb/mariadb-storage-vendor';
import utilityQueries from './infrastracture/concrete/mariadb/utils/utility-queries';
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
    await this.connector.start(utilityQueries.InitializeTables);
    const storageVendor = new MariaDBStorageVendor(this.connector);
    const controllerSchema = parseSchema(path.join(__dirname, `..${path.sep}`, 'schemas', 'controller_schema.json'));
    const routeSchema = parseRouteSchema(path.join(__dirname, `..${path.sep}`, 'schemas', 'route_schema.json'));
    const controller = new Controller(storageVendor, controllerSchema);
    this.gateway = new ExpressGateway(routeSchema, controller);
    const port = +<string>process.env.PORT || expressConfig.port || 0;
    await this.gateway.open(port, '0.0.0.0');
  }

  async stop() {
    await (this.gateway as ExpressGateway).close();
    await this.connector.stop();
  }
}
