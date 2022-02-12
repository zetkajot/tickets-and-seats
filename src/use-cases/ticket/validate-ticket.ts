import UseCase from '../use-case';

type Input = {
  ticketId: string,
};

type Output = {
  ticketId: string,
  eventName: string,
  hallName: string,
  startingDate: Date,
  seatNo: number,
};

export default class ValidateTicket extends UseCase<Input, Output> {
  async execute({ ticketId }: Input): Promise<Output> {
    const targetTicket = await this.adaptedDataVendor.findUniqueTicket(ticketId);
    const relatedEvent = await this.adaptedDataVendor.findUniqueRelatedEvent(targetTicket.event.id);
    const relatedHall = await this.adaptedDataVendor.findUniqueRelatedHall(relatedEvent.hallId);

    return {
      ticketId: targetTicket.id,
      eventName: relatedEvent.name,
      hallName: relatedHall.name,
      startingDate: relatedEvent.startsAt,
      seatNo: targetTicket.seatNo,
    };
  }
}
