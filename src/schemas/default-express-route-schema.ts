import { Request } from 'express';
import { ControllerRequestArguments } from '../controller/types/controller-request-arguments';
import { ExpressRouteSchema } from '../gateways/express/types/express-route-schema';

const defaultExpressRouteSchema: ExpressRouteSchema = {
  findOneEvent: {
    method: 'GET',
    path: '/event',
    argumentExtractor: extractArgsFromQuery,
  },
  findEvents: {
    method: 'GET',
    path: '/event/find',
    argumentExtractor: extractArgsFromQuery,
  },
  createEvent: {
    method: 'POST',
    path: '/event',
    argumentExtractor: extractArgsFromQuery,
  },
  deleteEvent: {
    method: 'DELETE',
    path: '/event',
    argumentExtractor: extractArgsFromQuery,
  },
  openEvent: {
    method: 'PUT',
    path: '/event/open',
    argumentExtractor: extractArgsFromQuery,
  },
  closeEvent: {
    method: 'PUT',
    path: '/event/close',
    argumentExtractor: extractArgsFromQuery,
  },
  getEventSeats: {
    method: 'GET',
    path: '/event/seats',
    argumentExtractor: extractArgsFromQuery,
  },
  findOneHall: {
    method: 'GET',
    path: '/hall',
    argumentExtractor: extractArgsFromQuery,
  },
  findHalls: {
    method: 'GET',
    path: '/hall/find',
    argumentExtractor: extractArgsFromQuery,
  },
  createHall: {
    method: 'POST',
    path: '/hall',
    argumentExtractor: extractArgsFromQuery,
  },
  deleteHall: {
    method: 'DELETE',
    path: '/hall',
    argumentExtractor: extractArgsFromQuery,
  },
  issueTicket: {
    method: 'POST',
    path: '/ticket',
    argumentExtractor: extractArgsFromQuery,
  },
  cancelTicket: {
    method: 'DELETE',
    path: '/ticket',
    argumentExtractor: extractArgsFromQuery,
  },
  checkTicket: {
    method: 'GET',
    path: '/ticket',
    argumentExtractor: extractArgsFromQuery,
  },

};

export default defaultExpressRouteSchema;

function extractArgsFromQuery(request: Request): ControllerRequestArguments {
  return Object.entries(request.query)
    .map(([name, value]) => ({ name: name as string, value: value as string }));
}
