import makeStubHall from './make-stub-hall';
import Event from '../event';

export default function makeStubEvent() {
  return new Event(
    'id',
    'example',
    new Date('2022-01-10T11:30:00'),
    new Date('2022-01-10T12:30:00'),
    makeStubHall(),
  );
}
