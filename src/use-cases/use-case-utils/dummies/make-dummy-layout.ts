import SeatLayout from '../../../domain/seat-layout';

export default function makeDummyLayout(reservedSeats: number[]): SeatLayout {
  const seatLayout = new SeatLayout();
  reservedSeats.forEach((seatNo) => seatLayout.addSeat(seatNo, [0, 0]));
  return seatLayout;
}
