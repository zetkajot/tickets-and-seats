import AppManager from './app-manager';

const manager = new AppManager();

manager.start().then(() => {
  // eslint-disable-next-line no-console
  console.log('App started!');
});
