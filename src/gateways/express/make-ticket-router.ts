import { Router } from 'express';
import Controller from '../../controllers/controller';
import handleRoute from './handle-route';

export default function makeTicketRouter(controller: Controller) {
  const ticketRouter = Router();

  const handle = handleRoute.bind(null, controller);

  ticketRouter.post('/issue', async (req, res) => {
    await handle('issue-ticket', req, res);
  });

  return ticketRouter;
}
