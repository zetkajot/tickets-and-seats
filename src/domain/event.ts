import DomainError, { DomainErrorSubtype } from './errrors/domain-error';
import Hall from './hall';

export default class Event {
  private reservedSeatsNumbers: Set<number>;

  private isOpened: boolean;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly startsAt: Date,
    public readonly endsAt: Date,
    private hall: Hall,
  ) {
    if (!this.areEventDatesValid()) {
      throw new DomainError(DomainErrorSubtype.EVENT_INVALID_DATE);
    }
    this.isOpened = false;
    this.reservedSeatsNumbers = new Set();
  }

  get hallId() {
    return this.hall.id;
  }

  private areEventDatesValid(): boolean {
    return this.startsAt.getTime() < this.endsAt.getTime();
  }

  get reservedSeats(): number[] {
    return Array.from(this.reservedSeatsNumbers);
  }

  get isOpenForReservations(): boolean {
    return this.isOpened;
  }

  closeForReservations(): void {
    if (!this.isOpened) {
      throw new DomainError(DomainErrorSubtype.EVENT_CLOSED_TWICE);
    }
    this.isOpened = false;
  }

  openForReservations(): void {
    if (this.isOpened) {
      throw new DomainError(DomainErrorSubtype.EVENT_OPENED_TWICE);
    }
    this.isOpened = true;
  }

  reserveSeat(seatNo: number): void {
    this.checkIfEventIsOpenAndSeatExists(seatNo);

    if (this.isReserved(seatNo)) {
      throw new DomainError(DomainErrorSubtype.EVENT_SEAT_RESERVED);
    }
    this.reservedSeatsNumbers.add(seatNo);
  }

  unreserveSeat(seatNo: number): void {
    this.checkIfEventIsOpenAndSeatExists(seatNo);

    if (!this.isReserved(seatNo)) {
      throw new DomainError(DomainErrorSubtype.EVENT_SEAT_NOT_RESERVED);
    }
    this.reservedSeatsNumbers.delete(seatNo);
  }

  public isReserved(seatNo: number): boolean {
    this.checkIfSeatExists(seatNo);
    return this.reservedSeats.includes(seatNo);
  }

  private checkIfEventIsOpenAndSeatExists(seatNo: number): void {
    this.checkIfEventIsOpen();
    this.checkIfSeatExists(seatNo);
  }

  private checkIfEventIsOpen(): void {
    if (!this.isOpened) {
      throw new DomainError(DomainErrorSubtype.EVENT_CLOSED);
    }
  }

  private checkIfSeatExists(seatNo: number) {
    if (!this.hall.hasSeat(seatNo)) {
      throw new DomainError(DomainErrorSubtype.EVENT_UNKNOWN_SEAT);
    }
  }

  public hasSeat(seatNo: number) {
    return this.hall.hasSeat(seatNo);
  }
}
