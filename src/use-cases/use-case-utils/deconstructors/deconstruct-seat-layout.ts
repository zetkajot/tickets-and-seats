import SeatLayout from '../../../domain/seat-layout';

export default function deconstructSeatLayout(layout: SeatLayout): [number, number, number][] {
  const deconstructedLayout: [number, number, number][] = [];
  layout.layout.forEach(({ seatNo, position }) => {
    deconstructedLayout.push([seatNo, ...position]);
  });
  return deconstructedLayout;
}
