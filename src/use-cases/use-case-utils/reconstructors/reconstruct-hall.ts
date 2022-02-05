import Hall from '../../../domain/hall';
import SeatLayout from '../../../domain/seat-layout';
import { StoredHallData } from '../../../infrastracture/storage-vendors/hall-storage-vendor';

function reconstructLayout(storedLayout: [number, number, number][]): SeatLayout {
  const layout = new SeatLayout();
  storedLayout.forEach(([seatNo, ...point]) => {
    layout.addSeat(seatNo, point);
  });
  return layout;
}

export default function reconstructHall(storedData: StoredHallData): Hall {
  const layout = reconstructLayout(storedData.layout);
  return new Hall(storedData.id, storedData.name, layout);
}
