import { expect } from 'chai';
import Sinon from 'sinon';
import CombinedStorageVendor from '../../infrastracture/storage-vendors/combined-storage-vendor';
import InvalidDataError from '../use-case-utils/errors/invalid-data-error';
import IssueTicket from './issue-ticket';

const validEventData = Object.freeze({
  id: 'event id',
  name: 'example name',
  hallId: 'hall id',
  startsAt: new Date('2022'),
  endsAt: new Date('2023'),
  isOpen: true,
  reservedSeats: [],
});

const validHallData = Object.freeze({
  id: 'hall id',
  name: 'example hall',
  layout: [
    [1, 0, 0],
    [2, 1, 1],
  ],
});

const validDataVendor = Object.freeze({
  findHall: Sinon.spy(async () => [validHallData]),
  findEvent: Sinon.spy(async () => [validEventData]),
  saveEvent: Sinon.spy(async () => {}),
  saveTicket: Sinon.spy(async () => {}),
}) as unknown as CombinedStorageVendor;

let dataVendor = validDataVendor;

describe('Issue Ticket Use Case test suite', () => {
  beforeEach(() => {
    dataVendor = { ...validDataVendor };
    Sinon.reset();
  });
  it('Throws InvalidDataError when event with given id does not exist', () => {
    dataVendor.findEvent = async () => [];
    const useCase = new IssueTicket(dataVendor);

    const tryIssuing = () => useCase.execute({ eventId: 'example non-event id', seatNo: 1 });

    return expect(tryIssuing())
      .to.eventually.be.rejected
      .and.to.be.an.instanceOf(InvalidDataError);
  });
  it('Throws InvalidDataError when event is closed for reservations', () => {
    dataVendor.findEvent = async () => [{
      ...validEventData,
      isOpen: false,
    }];
    const useCase = new IssueTicket(dataVendor);

    const tryIssuing = () => useCase.execute({ eventId: 'example event id', seatNo: 1 });

    return expect(tryIssuing())
      .to.eventually.be.rejected
      .and.to.be.an.instanceOf(InvalidDataError);
  });
  it('Throws InvalidDataError when provided seat is taken', () => {
    dataVendor.findEvent = async () => [{
      ...validEventData,
      reservedSeats: [1],
    }];
    const useCase = new IssueTicket(dataVendor);

    const tryIssuing = () => useCase.execute({ eventId: 'example event id', seatNo: 1 });

    return expect(tryIssuing())
      .to.eventually.be.rejected
      .and.to.be.an.instanceOf(InvalidDataError);
  });
  it('Throws InvalidDataError if seat with given number does not exist', () => {
    const useCase = new IssueTicket(dataVendor);

    const tryIssuing = () => useCase.execute({ eventId: 'example event id', seatNo: 3 });

    return expect(tryIssuing())
      .to.eventually.be.rejected
      .and.to.be.an.instanceOf(InvalidDataError);
  });
  describe('When succeeds', () => {
    it('Saves issued ticket in storage', async () => {
      const useCase = new IssueTicket(dataVendor);

      await useCase.execute({ eventId: 'event id', seatNo: 1 });

      expect(dataVendor.saveTicket).to.have.been.calledWithMatch({
        seatNo: 1,
        eventId: 'event id',
      });
    });
    it('Marks seat as reserved in given event', async () => {
      const useCase = new IssueTicket(dataVendor);

      await useCase.execute({ eventId: 'example event id', seatNo: 1 });

      expect(dataVendor.saveEvent).to.have.been.calledOnceWith(Sinon.match({
        reservedSeats: [1],
      }));
    });
    it('Returns issued ticket inormations', async () => {
      const useCase = new IssueTicket(dataVendor);

      const output = await useCase.execute({ eventId: 'example event id', seatNo: 1 });

      expect(output).to.deep.include({
        eventName: 'example name',
        eventId: 'event id',
        seatNo: 1,
        hallName: 'example hall',
        eventStartingDate: new Date('2022'),
        eventEndingDate: new Date('2023'),
      });
    });
  });
});
