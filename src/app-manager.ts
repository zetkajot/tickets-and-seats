import path from 'path';
import Controller from './controller/controller';
import parseSchema from './controller/schema-parser/parse-schema';
import ExpressGateway from './gateways/express/expres-gateway';
import MariaDBConnector from './infrastracture/concrete/mariadb/mariadb-connector';
import MariaDBStorageVendor from './infrastracture/concrete/mariadb/mariadb-storage-vendor';
import QueryExecutorsFactory from './infrastracture/concrete/mariadb/query-executors/query-executors-factory';
import defaultExpressRouteSchema from './schemas/default-express-route-schema';
import ConfigSingleton from './utils/config-singleton';

const { mariadbConfig } = ConfigSingleton.getConfig();

export default class AppManager {
  private connector: MariaDBConnector;

  private gateway: ExpressGateway | undefined;

  constructor() {
    this.connector = new MariaDBConnector(mariadbConfig);
    this.bindSIGINT();
  }

  private bindSIGINT() {
    process.once('SIGINT', async () => { await this.stop(); });
  }

  async start(port: number) {
    await this.connector.start();
    const storageVendor = new MariaDBStorageVendor(this.connector, new QueryExecutorsFactory());
    const controllerSchema = parseSchema(path.join(__dirname, 'schemas', 'controller_schema.json'));
    const controller = new Controller(storageVendor, controllerSchema);
    this.gateway = new ExpressGateway(defaultExpressRouteSchema, controller);
    await this.gateway.open(port);
  }

  async stop() {
    await (this.gateway as ExpressGateway).close();
    await this.connector.stop();
  }
}
