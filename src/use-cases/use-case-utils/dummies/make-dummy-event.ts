import Event from '../../../domain/event';
import Hall from '../../../domain/hall';
import makeDummyHall from './make-dummy-hall';

interface DummyEventFactoryInput {
  id?: string,
  name?: string,
  hall?: Hall,
  startsAt?: Date,
  endsAt?: Date,
  isOpen?: boolean,
  reservedSeats?: number[]
}

const defaultDummyEventFactoryInput: DummyEventFactoryInput = {
  id: 'example event id',
  name: 'example event name',
  hall: makeDummyHall(),
  startsAt: new Date('2020'),
  endsAt: new Date('2021'),
  isOpen: false,
  reservedSeats: [],
};

export default function makeDummyEvent(input = defaultDummyEventFactoryInput) {
  const {
    id, name, startsAt, endsAt, hall, isOpen, reservedSeats,
  } = {
    ...defaultDummyEventFactoryInput,
    ...input,
  };
  const event = new Event(
    id as string,
    name as string,
    startsAt as Date,
    endsAt as Date,
    hall as Hall,
  );
  if ((reservedSeats as number[]).length > 0) {
    event.openForReservations();
    (reservedSeats as number[]).forEach((seatNo) => {
      event.reserveSeat(seatNo);
      if (!(hall as Hall).hasSeat(seatNo)) (hall as Hall).layout.addSeat(seatNo, [0, 0]);
    });
    event.closeForReservations();
  }
  if (isOpen as boolean) {
    event.openForReservations();
  }
  return event;
}
