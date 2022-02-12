import DomainError from '../../../domain/errrors/domain-error';
import ErrorFactory from '../../../error/error-factory';
import Rethrower from '../../../utils/rethrow/rethrower';
import DiscrepancyError from '../errors/discrapency-error';
import InternalError, { InternalErrorSubtype } from '../errors/internal-error';
import InvalidDataError, { InvalidDataErrorSubtype } from '../errors/invalid-data-error';

type EntityInteractionOptions = {
  onDomainError: 'InvalidDataError',
  errorSubtype: InvalidDataErrorSubtype,
} | { onDomainError: 'DiscrepancyError' };

export default function tryEntityInteraction(options: EntityInteractionOptions = {
  onDomainError: 'InvalidDataError',
  errorSubtype: InvalidDataErrorSubtype.NOT_SPECIFIED,
}) {
  if (options.onDomainError === 'DiscrepancyError') {
    return throwingDiscrepancyError;
  }
  return throwingInvalidDataError.bind(null, options.errorSubtype);
}

function throwingDiscrepancyError<T extends (
  ...args: any[])=> any>(
  interaction: T,
  ...interactionArgs: Parameters<T>
): ReturnType<T> {
  const context = new Rethrower<ReturnType<T>, T>(interaction);
  context.addRethrow(
    DomainError,
    () => ErrorFactory.getInstance().makeError(
      DiscrepancyError,
    ),
  );
  context.addRethrow(
    Error,
    (error) => ErrorFactory.getInstance().makeError(
      InternalError,
      InternalErrorSubtype.UNKNOWN_ERROR,
      error,
    ),
  );
  return context.execute(...interactionArgs);
}

function throwingInvalidDataError<T extends (
  ...args: any[])=> any>(
  errorSubtype: InvalidDataErrorSubtype,
  interaction: T,
  ...interactionArgs: Parameters<T>
): ReturnType<T> {
  const context = new Rethrower<ReturnType<T>, T>(interaction);
  context.addRethrow(
    DomainError,
    () => ErrorFactory.getInstance().makeError(
      InvalidDataError,
      errorSubtype,
    ),
  );
  context.addRethrow(
    Error,
    (error) => ErrorFactory.getInstance().makeError(
      InternalError,
      InternalErrorSubtype.UNKNOWN_ERROR,
      error,
    ),
  );
  return context.execute(...interactionArgs);
}
