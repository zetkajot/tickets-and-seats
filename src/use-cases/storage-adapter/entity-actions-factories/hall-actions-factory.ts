/* eslint-disable class-methods-use-this */
import Hall from '../../../domain/hall';
import { StoredHallData } from '../../../infrastracture/storage-vendors/hall-storage-vendor';
import deconstructHall from '../../use-case-utils/deconstructors/deconstruct-hall';
import reconstructHall from '../../use-case-utils/reconstructors/reconstruct-hall';
import tryExecutingStorageQuery from '../../use-case-utils/try-catch-shorthands/try-executing-storage-query';
import tryFindingEntityData from '../../use-case-utils/try-catch-shorthands/try-finding-entity-data';
import tryReconstructing from '../../use-case-utils/try-catch-shorthands/try-reconstructing';
import {
  FindMany, FindOne, DeleteOne, SaveOne,
} from '../entity-actions';
import AbstractEntityActionsFactory from './abstract-entity-actions-factory';

export default class HallActionsFactory extends AbstractEntityActionsFactory<Hall, StoredHallData> {
  makeFindMany(): FindMany<Hall, StoredHallData> {
    const { storageVendor } = this;

    return async function findMany(
      params: Partial<Omit<StoredHallData, 'layout' | 'id' >>,
    ): Promise<Hall[]> {
      const hallDataSet = <StoredHallData[]> await tryFindingEntityData.customized({
        allowEmpty: true,
        related: false,
        unique: false,
      })(storageVendor.findHall.bind(storageVendor), params);

      return <Hall[]> hallDataSet.map((hallData) => tryReconstructing(
        reconstructHall,
        hallData,
      ));
    };
  }

  makeFindManyRelated(): FindMany<Hall, StoredHallData> {
    const { storageVendor } = this;

    return async function findManyRelated(
      params: Partial<Omit<StoredHallData, 'layout' | 'id' >>,
    ): Promise<Hall[]> {
      const hallDataSet = <StoredHallData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: true,
        unique: false,
      })(storageVendor.findHall.bind(storageVendor), params);

      return <Hall[]> hallDataSet.map((hallData) => tryReconstructing(
        reconstructHall,
        hallData,
      ));
    };
  }

  makeFindUnique(): FindOne<Hall, any> {
    const { storageVendor } = this;

    return async function findUnique(hallId: string): Promise<Hall> {
      const hallDataSet = <StoredHallData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: false,
        unique: true,
      })(storageVendor.findHall.bind(storageVendor), { id: hallId });

      return <Hall> hallDataSet.map((hallData) => tryReconstructing(
        reconstructHall,
        hallData,
      ))[0];
    };
  }

  makeFindUniqueRelated(): FindOne<Hall, any> {
    const { storageVendor } = this;

    return async function findUniqueRelated(hallId: string): Promise<Hall> {
      const hallDataSet = <StoredHallData[]> await tryFindingEntityData.customized({
        allowEmpty: false,
        related: true,
        unique: true,
      })(storageVendor.findHall.bind(storageVendor), { id: hallId });

      return <Hall> hallDataSet.map((hallData) => tryReconstructing(
        reconstructHall,
        hallData,
      ))[0];
    };
  }

  makeDeleteOne(): DeleteOne<Hall> {
    const { storageVendor } = this;
    return async function deleteOne(hall: Hall): Promise<void> {
      await tryExecutingStorageQuery(
        storageVendor.deleteHall.bind(storageVendor),
        hall.id,
      );
    };
  }

  makeSaveOne(): SaveOne<Hall> {
    const { storageVendor } = this;
    return async function saveOne(hall: Hall): Promise<void> {
      await tryExecutingStorageQuery(
        storageVendor.saveHall.bind(storageVendor),
        deconstructHall(hall),
      );
    };
  }
}
