import DomainError from '../../../domain/errrors/domain-error';
import ErrorFactory from '../../../error/error-factory';
import Rethrower from '../../../utils/rethrow/rethrower';
import InvalidDataError, { InvalidDataErrorSubtype } from '../errors/invalid-data-error';

export default function tryInstantiating(
  { possibleError }: { possibleError: InvalidDataErrorSubtype }
  = { possibleError: InvalidDataErrorSubtype.NOT_SPECIFIED },
) {
  return tryInstantiatingWithErrorSubtype.bind(
    null,
    possibleError,
  );
}

function tryInstantiatingWithErrorSubtype<
Entity,
EntityConstructor extends { new(
  ...args: any[]): Entity },
>(
  errorSubtype: InvalidDataErrorSubtype,
  constructor: EntityConstructor,
  ...constructorArgs: ConstructorParameters<EntityConstructor>
): Entity {
  const instantiate = () => new constructor(...constructorArgs);
  const rethrowingContext = new Rethrower(instantiate);
  rethrowingContext.addRethrow(
    DomainError,
    () => ErrorFactory
      .getInstance()
      .makeError(InvalidDataError, errorSubtype),
  );
  return <Entity> rethrowingContext.execute();
}
