import basicSchema from './controllers/schemas/basic-schema';
import Controller from './controllers/controller';
import makeApp from './gateways/express/make-app';
import MemoryStorageVendor from './infrastracture/concrete/memory-storage-vendor';
import ErrorFactory from './error/error-factory';

const controller = new Controller(basicSchema, new MemoryStorageVendor());
const expressApp = makeApp(controller, ['create-hall', 'create-event', 'find-event-by-id', 'find-hall-by-id']);

ErrorFactory.setDefaultLogger();

expressApp.listen(2137, () => {
  console.log('Listening!');
});
