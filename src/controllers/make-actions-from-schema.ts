import CombinedStorageVendor from '../infrastracture/storage-vendors/combined-storage-vendor';
import { ActionSchema } from './types/action-schema';
import { Actions } from './types/actions';

export default function makeActionsFromSchema(
  schema: ActionSchema,
  storageVendor: CombinedStorageVendor,
): Actions {
  return Object.fromEntries(
    Object.entries(schema)
      .map(([actionName, { converter, UseCase }]) => ([
        actionName, {
          converter,
          // eslint-disable-next-line new-cap
          useCase: new UseCase(storageVendor),
        }])),
  );
}
