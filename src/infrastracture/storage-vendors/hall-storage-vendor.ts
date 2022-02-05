export default interface HallStorageVendor {
  saveHall(data: StoredHallData): Promise<void>;
  findHall(data: Partial<Omit<StoredHallData, 'layout'>>): Promise<StoredHallData[]>;
  deleteHall(hallId: string): Promise<void>;
}

export type StoredHallData = {
  id: string;
  name: string;
  layout: [seatNo: number, x: number, y: number][];
};
