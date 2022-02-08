import Event from '../../../domain/event';
import Hall from '../../../domain/hall';
import makeHallDummy from './make-hall-dummy';

export default function makeDummyEvent(
  id: string = 'example event id',
  name: string = 'example event name',
  hall: Hall = makeHallDummy('example hall id'),
  startsAt: Date = new Date('2020'),
  endsAt: Date = new Date('2021'),

) {
  return new Event(
    id,
    name,
    startsAt,
    endsAt,
    hall,
  );
}
