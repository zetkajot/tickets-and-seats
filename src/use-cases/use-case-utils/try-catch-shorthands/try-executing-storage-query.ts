import AsyncRethrower from '../../../utils/rethrow/async-rethrower';
import storageQuery from '../../../utils/rethrow/rehtrowing-templates/storage-query';

export default async function tryExecutingStorageQuery<
  Result,
  Query extends (...args: any[])=>Promise<Result>,
>(queryFn: Query, ...queryArgs: Parameters<Query>): Promise<Result> {
  const safeContext = AsyncRethrower.fromTemplate(storageQuery, queryFn);
  const queryResult = await safeContext.asyncExecute(...queryArgs);
  return queryResult as Result;
}
