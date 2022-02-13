import ErrorFactory from './error/error-factory';
import makeMariaDBStorageVendor from './infrastracture/concrete/mariadb/make-maria-db-storage-vendor';
import ConfigSingleton from './utils/config-singleton';
import makeController from './controllers/make-controller';
import ExpressGateway from './gateways/express/expres-gateway';
import defaultRouteMapper from './gateways/express/default-route-mapper';
import makeActionsFromSchema from './controllers/make-action-schema';
import defaultActionSchema from './controllers/action-schemas/default-action-schema';

start().then(() => {
  console.log('App started!');
});

async function start() {
  const gateway = new ExpressGateway(defaultRouteMapper);
  const storageVendor = await makeMariaDBStorageVendor(ConfigSingleton.getConfig().mariadbConfig);
  const actions = makeActionsFromSchema(defaultActionSchema, storageVendor);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const controller = makeController(actions, gateway);

  ErrorFactory.setDefaultLogger();

  gateway.expressApp.listen(2137);
}
