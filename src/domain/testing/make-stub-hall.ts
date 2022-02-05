import Hall from '../hall';
import SeatLayout from '../seat-layout';

export default function makeStubHall() {
  const layout = new SeatLayout();
  layout.addSeat(1, [0, 0]);
  layout.addSeat(2, [0, 0]);
  return new Hall('example-hall-id', 'example', layout);
}
