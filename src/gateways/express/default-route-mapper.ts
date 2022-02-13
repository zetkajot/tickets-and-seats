import { RouteData } from './types/route-data';

export default function defaultRouteMapper(actionName: string): RouteData {
  if (routeLookup.has(actionName)) {
    return routeLookup.get(actionName) as RouteData;
  }
  throw new Error(`Cannot resolve action ${actionName}into route!`);
}

const routeLookup = new Map<string, RouteData>([
  ['closeEvent', { method: 'PUT', path: '/event/close' }],
  ['openEvent', { method: 'PUT', path: '/event/open' }],
  ['createEvent', { method: 'POST', path: '/event' }],
  ['deleteEvent', { method: 'DELETE', path: '/event' }],
  ['findEventById', { method: 'GET', path: '/event' }],
  ['findEvents', { method: 'GET', path: '/event/find' }],
  ['getEventSeatInfo', { method: 'GET', path: '/event/seats' }],
  ['createHall', { method: 'POST', path: '/hall' }],
  ['deleteHall', { method: 'DELETE', path: '/hall' }],
  ['findHallById', { method: 'GET', path: '/hall' }],
  ['findHalls', { method: 'GET', path: '/hall/find' }],
  ['issueTicket', { method: 'POST', path: '/ticket' }],
  ['cancelTicket', { method: 'DELETE', path: '/ticket' }],
  ['validateTicket', { method: 'GET', path: '/ticket' }],
]);
