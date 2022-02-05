import DomainError, { DomainErrorSubtype } from './errrors/domain-error';

type Point2D = [number, number];

export default class SeatLayout {
  constructor(private internalLayout: Map<number, Point2D> = new Map()) {}

  get layout(): { seatNo: number, position: Point2D }[] {
    const returnedData: { seatNo: number, position: Point2D }[] = [];

    this.internalLayout.forEach((position, seatNo) => {
      returnedData.push({ seatNo, position });
    });

    return returnedData;
  }

  addSeat(seatNo: number, seatPos: Point2D): void {
    if (this.hasSeat(seatNo)) {
      throw new DomainError(DomainErrorSubtype.LAYOUT_NON_UNIQUE_NUMBERS);
    }
    this.internalLayout.set(seatNo, seatPos);
  }

  removeSeat(seatNo: number): void {
    if (!this.hasSeat(seatNo)) {
      throw new DomainError(DomainErrorSubtype.LAYOUT_UNKNOWN_SEAT);
    }
    this.internalLayout.delete(seatNo);
  }

  public hasSeat(seatNo: number): boolean {
    return this.internalLayout.has(seatNo);
  }
}
