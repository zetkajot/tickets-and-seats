import Hall from '../../../domain/hall';
import { StoredHallData } from '../../../infrastracture/storage-vendors/hall-storage-vendor';
import deconstructSeatLayout from './deconstruct-seat-layout';

export default function deconstructHall(hall: Hall): StoredHallData {
  return {
    ...hall,
    layout: deconstructSeatLayout(hall.layout),
  };
}
