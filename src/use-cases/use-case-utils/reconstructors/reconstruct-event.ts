import { StoredEventData } from '../../../infrastracture/storage-vendors/event-storage-vendor';
import Event from '../../../domain/event';
import Hall from '../../../domain/hall';

export default function reconstructEvent(
  storedEventData: StoredEventData,
  hall: Hall,
): Event {
  const event = new Event(
    storedEventData.id,
    storedEventData.name,
    storedEventData.startsAt,
    storedEventData.endsAt,
    hall,
  );

  event.openForReservations();
  storedEventData.reservedSeats.forEach((seatNo) => event.reserveSeat(seatNo));
  event.closeForReservations();

  if (storedEventData.isOpen) {
    event.openForReservations();
  }
  return event;
}
