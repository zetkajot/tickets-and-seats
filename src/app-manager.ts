import path from 'path';
import Controller from './controller/controller';
import parseSchema from './controller/schema-parser/parse-schema';
import ExpressGateway from './gateways/express/expres-gateway';
import makeMariaDBStorageVendor from './infrastracture/concrete/mariadb/make-mariadb-storage-vendor';
import MariaDBStorageVendor from './infrastracture/concrete/mariadb/mariadb-storage-vendor';
import defaultExpressRouteSchema from './schemas/default-express-route-schema';
import ConfigSingleton from './utils/config-singleton';

const { mariadbConfig } = ConfigSingleton.getConfig();

export default class AppManager {
  private storageVendor: MariaDBStorageVendor;

  private gateway: ExpressGateway;

  constructor() {
    this.storageVendor = makeMariaDBStorageVendor(mariadbConfig);
    const controllerSchema = parseSchema(path.join(__dirname, 'schemas\\controller_schema.json'));
    const controller = new Controller(this.storageVendor, controllerSchema);
    this.gateway = new ExpressGateway(defaultExpressRouteSchema, controller);

    this.bindSIGINT();
  }

  private bindSIGINT() {
    process.once('SIGINT', async () => { await this.stop(); });
  }

  async start(port: number) {
    await this.storageVendor.start();
    await this.gateway.open(port);
  }

  async stop() {
    await this.gateway.close();
    await this.storageVendor.stop();
  }
}
