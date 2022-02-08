import { randomUUID } from 'crypto';
import Hall from '../../../domain/hall';
import SeatLayout from '../../../domain/seat-layout';

export default function makeDummyHall(id = randomUUID(), name = 'example hall', layout = new SeatLayout()): Hall {
  return new Hall(id, name, layout);
}
