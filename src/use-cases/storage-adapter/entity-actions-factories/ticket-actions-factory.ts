/* eslint-disable class-methods-use-this */
import Ticket from '../../../domain/ticket';
import { StoredTicketData } from '../../../infrastracture/storage-vendors/ticket-storage-vendor';
import deconstructTicket from '../../use-case-utils/deconstructors/deconstruct-ticket';
import makeDummyEvent from '../../use-case-utils/dummies/make-dummy-event';
import reconstructTicket from '../../use-case-utils/reconstructors/reconstruct-ticket';
import tryExecutingStorageQuery from '../../use-case-utils/try-catch-shorthands/try-executing-storage-query';
import tryFindingEntityData from '../../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import {
  FindMany, FindOne, DeleteOne, SaveOne,
} from '../entity-actions';
import AbstractEntityActionsFactory from './abstract-entity-actions-factory';

export default class TicketActionsFactory
  extends AbstractEntityActionsFactory<Ticket, StoredTicketData> {
  makeFindMany(): FindMany<Ticket, StoredTicketData> {
    const { storageVendor } = this;

    return async function findMany(params: Partial<Pick<StoredTicketData, 'eventId'>>): Promise<Ticket[]> {
      const ticketDataSet = <StoredTicketData[]> await tryFindingEntityData.customized({
        allowEmpty: true,
        related: false,
        unique: false,
      })(storageVendor.findTicket.bind(storageVendor), params);
      return <Ticket[]> ticketDataSet.map((ticketData) => reconstructTicket(
        ticketData,
        makeDummyEvent(ticketData.eventId),
      ));
    };
  }

  makeFindManyRelated(): FindMany<Ticket, StoredTicketData> {
    const { storageVendor } = this;

    return async function findManyRelated(
      params: Partial<Pick<StoredTicketData, 'eventId'>>,
    ): Promise<Ticket[]> {
      const ticketDataSet = <StoredTicketData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: true,
        unique: false,
      })(storageVendor.findTicket.bind(storageVendor), params);
      return <Ticket[]> ticketDataSet.map((ticketData) => reconstructTicket(
        ticketData,
        makeDummyEvent(ticketData.eventId),
      ));
    };
  }

  makeFindUnique(): FindOne<Ticket, any> {
    const { storageVendor } = this;

    return async function findUnique(
      ticketId: string,
    ): Promise<Ticket> {
      const ticketDataSet = <StoredTicketData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: false,
        unique: true,
      })(storageVendor.findTicket.bind(storageVendor), { id: ticketId });
      return <Ticket> ticketDataSet.map((ticketData) => reconstructTicket(
        ticketData,
        makeDummyEvent(ticketData.eventId),
      ))[0];
    };
  }

  makeFindUniqueRelated(): FindOne<Ticket, any> {
    const { storageVendor } = this;

    return async function findUniqueReleated(
      ticketId: string,
    ): Promise<Ticket> {
      const ticketDataSet = <StoredTicketData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: true,
        unique: true,
      })(storageVendor.findTicket.bind(storageVendor), { id: ticketId });
      return <Ticket> ticketDataSet.map((ticketData) => reconstructTicket(
        ticketData,
        makeDummyEvent(ticketData.eventId),
      ))[0];
    };
  }

  makeDeleteOne(): DeleteOne<Ticket> {
    const { storageVendor } = this;

    return async function deleteOne(ticket: Ticket): Promise<void> {
      await tryExecutingStorageQuery(
        storageVendor.deleteTicket.bind(storageVendor),
        ticket.id,
      );
    };
  }

  makeSaveOne(): SaveOne<Ticket> {
    const { storageVendor } = this;

    return async function saveOne(ticket: Ticket): Promise<void> {
      await tryExecutingStorageQuery(
        storageVendor.saveTicket.bind(storageVendor),
        deconstructTicket(ticket),
      );
    };
  }
}
