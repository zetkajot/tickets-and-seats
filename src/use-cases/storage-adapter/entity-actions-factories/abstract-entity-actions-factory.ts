import CombinedStorageVendor from '../../../infrastracture/storage-vendors/combined-storage-vendor';
import {
  DeleteOne, FindMany, FindOne, SaveOne,
} from '../entity-actions';

export default abstract class AbstractEntityActionsFactory<Entity, EntityData> {
  constructor(protected storageVendor: CombinedStorageVendor) {}

  abstract makeFindMany(): FindMany<Entity, EntityData>;
  abstract makeFindManyRelated(): FindMany<Entity, EntityData>;
  abstract makeFindUnique<T>(): FindOne<Entity, T>;
  abstract makeFindUniqueRelated<T>(): FindOne<Entity, T>;
  abstract makeDeleteOne(entity: Entity): DeleteOne<Entity>;
  abstract makeSaveOne(): SaveOne<Entity>;
}
