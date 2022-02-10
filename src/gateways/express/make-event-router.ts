import { Router } from 'express';
import Controller from '../../controllers/controller';
import handleRoute from './handle-route';

export default function makeEventRouter(controller: Controller) {
  const eventRouter = Router();

  const handle = handleRoute.bind(null, controller);

  eventRouter.get('/find', async (req, res) => {
    await handle('find-event-by-id', req, res);
  });

  eventRouter.post('/', async (req, res) => {
    await handle('create-event', req, res);
  });

  eventRouter.delete('/', async (req, res) => {
    await handle('delete-event', req, res);
  });

  eventRouter.post('/open', async (req, res) => {
    await handle('open-event', req, res);
  });

  eventRouter.post('/close', async (req, res) => {
    await handle('close-event', req, res);
  });

  eventRouter.get('/get-seats-info', async (req, res) => {
    await handle('get-event-seat-info', req, res);
  });

  return eventRouter;
}
