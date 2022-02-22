import path from 'path';
import AppManager from './app-manager';

const pathToControllerSchema = path.join(process.cwd(), 'schemas', 'controller_schema.json');
const pathToRouteSchema = path.join(process.cwd(), 'schemas', 'route_schema.json');
const pathToCert = path.join(process.cwd(), 'ssl', 'certificate.crt');
const pathToKey = path.join(process.cwd(), 'ssl', 'private.key');

const manager = new AppManager({
  pathToControllerSchema,
  pathToRouteSchema,
  pathToCert,
  pathToKey,
});

manager.start().then(() => {
  // eslint-disable-next-line no-console
  console.log('App started!');
});
