import UseCase from '../use-case';

type Input = {
  eventId: string
};

type Output = {
  eventId: string;
  eventName: string;
  hallName: string,
  startingDate: Date,
  endingDate: Date,
  isOpen: boolean,
};

export default class FindEventById extends UseCase<Input, Output> {
  async execute({ eventId }: Input): Promise<Output> {
    const event = await this.adaptedDataVendor.findUniqueEvent(eventId);
    const relatedHall = await this.adaptedDataVendor.findUniqueRelatedHall(event.hallId);

    return {
      eventId: event.id,
      eventName: event.name,
      hallName: relatedHall.name,
      startingDate: event.startsAt,
      endingDate: event.endsAt,
      isOpen: event.isOpenForReservations,
    };
  }
}
