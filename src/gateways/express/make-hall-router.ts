import { Router } from 'express';
import Controller from '../../controllers/controller';
import handleRoute from './handle-route';

export default function makeHallRouter(controller: Controller) {
  const hallRouter = Router();
  const handle = handleRoute.bind(null, controller);

  hallRouter.get('/find', async (req, res) => {
    await handle('find-hall-by-id', req, res);
  });

  hallRouter.post('/', async (req, res) => {
    await handle('create-hall', req, res);
  });

  hallRouter.delete('/', async (req, res) => {
    await handle('delete-hall', req, res);
  });

  return hallRouter;
}
