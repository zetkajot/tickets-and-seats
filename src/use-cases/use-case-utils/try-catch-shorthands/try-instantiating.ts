import DomainError from '../../../domain/errrors/domain-error';
import ErrorFactory from '../../../error/error-factory';
import Rethrower from '../../../utils/rethrow/rethrower';
import InvalidDataError, { InvalidDataErrorSubtype } from '../errors/invalid-data-error';

export default function tryInstantiating<
  Entity,
  EntityConstructor extends { new(
    ...args: any[]): Entity },
>(
  constructor: EntityConstructor,
  ...constructorArgs: ConstructorParameters<EntityConstructor>
): Entity {
  const instantiate = () => new constructor(...constructorArgs);
  const rethrowingContext = new Rethrower(instantiate);
  rethrowingContext.addRethrow(
    DomainError,
    () => ErrorFactory
      .getInstance()
      .makeError(InvalidDataError, InvalidDataErrorSubtype.NOT_SPECIFIED),
  );
  return <Entity> rethrowingContext.execute();
}
