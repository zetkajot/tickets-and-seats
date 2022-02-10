import basicSchema from './controllers/schemas/basic-schema';
import Controller from './controllers/controller';
import makeApp from './gateways/express/make-app';
import ErrorFactory from './error/error-factory';
import makeMariaDBStorageVendor from './infrastracture/concrete/mariadb/make-maria-db-storage-vendor';
import ConfigSingleton from './utils/config-singleton';

start().then(() => {
  console.log('App started!');
});

async function start() {
  const storageVendor = await makeMariaDBStorageVendor(ConfigSingleton.getConfig().mariadbConfig);

  const controller = new Controller(basicSchema, storageVendor);
  const expressApp = makeApp(controller, ['create-hall', 'create-event', 'find-event-by-id', 'find-hall-by-id']);
  ErrorFactory.setDefaultLogger();

  expressApp.listen(2137);
}
