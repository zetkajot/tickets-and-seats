import ErrorFactory from '../../../error/error-factory';
import DiscrepancyError from '../errors/discrapency-error';
import InvalidDataError, { InvalidDataErrorSubtype } from '../errors/invalid-data-error';
import tryExecutingStorageQuery from './try-executing-storage-query';

function tryFindingEntityData<
  EntityData,
  Finder extends (
    ...args: any[]) => Promise<EntityData[]>,
>(
  finderFn: Finder,
  ...finderArgs: Parameters<Finder>
): Promise<EntityData[]> {
  return tryFindingEntityDataWithOptions(undefined, finderFn, ...finderArgs);
}

// eslint-disable-next-line arrow-body-style
tryFindingEntityData.customized = bindFunctionWithOptions;

type TryFindingEntityDataFunctionType<
  EntityData,
  Finder extends (...args: any[]) => Promise<EntityData[]>,
> = (
  finderFn: Finder,
  ...finderArgs: Parameters<Finder>
) => Promise<EntityData[]>;

function bindFunctionWithOptions<
  EntityData,
  Finder extends (...args: any[]) => Promise<EntityData[]>,
>(options: Options): TryFindingEntityDataFunctionType<EntityData, Finder> {
  return tryFindingEntityDataWithOptions.bind<
  any,
  Options,
  Parameters<TryFindingEntityDataFunctionType<EntityData, Finder>>,
  ReturnType<TryFindingEntityDataFunctionType<EntityData, Finder>>
  >(undefined, options);
}

export default tryFindingEntityData;

type Options = {
  allowEmpty: boolean,
  unique: boolean,
  related: boolean,
};

async function tryFindingEntityDataWithOptions<
  EntityData,
  Finder extends (
    ...args: any[]) => Promise<EntityData[]>,
>(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  options:Options = {
    allowEmpty: true,
    unique: false,
    related: false,
  },
  finderFn: Finder,
  ...finderAgs: Parameters<Finder>
): Promise<EntityData[]> {
  const foundData = <EntityData[]> await tryExecutingStorageQuery(finderFn, ...finderAgs);

  if (foundData.length > 1 && options.unique) {
    throw ErrorFactory.getInstance().makeError(DiscrepancyError, new Error('Uniqueness violated!'));
  }
  if (foundData.length === 0 && !options.allowEmpty) {
    if (options.related) {
      throw ErrorFactory.getInstance().makeError(DiscrepancyError, new Error('Empty result not allowed!'));
    } else {
      throw ErrorFactory.getInstance()
        .makeError(InvalidDataError, InvalidDataErrorSubtype.ENTITY_NOT_FOUND);
    }
  }
  return foundData;
}
