import express from 'express';
import Controller from '../../controllers/controller';
import makeEventRouter from './make-event-router';
import makeHallRouter from './make-hall-router';
import makeTicketRouter from './make-ticket-router';

export default function makeApp(controller: Controller) {
  const app = express();

  app.use('/hall', makeHallRouter(controller));
  app.use('/event', makeEventRouter(controller));
  app.use('/ticket', makeTicketRouter(controller));

  return app;
}
