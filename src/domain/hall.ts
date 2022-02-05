import SeatLayout from './seat-layout';

export default class Hall {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly layout: SeatLayout,
  ) {}

  public hasSeat(seatNo: number): boolean {
    return this.layout.hasSeat(seatNo);
  }
}
