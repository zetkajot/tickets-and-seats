import AppManager from './app-manager';

const manager = new AppManager();

manager.start(2137).then(() => {
  console.log('App started!');
});
