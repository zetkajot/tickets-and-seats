import reconstructingFromStorageData from '../../../utils/rethrow/rehtrowing-templates/reconstructing-from-storage-data';
import Rethrower from '../../../utils/rethrow/rethrower';

export default function tryReconstructing<
  Entity,
  Reconstructor extends (...args: any[])=>Entity,
>(reconstructorFn: Reconstructor, ...reconstructorArgs: Parameters<Reconstructor>): Entity {
  return <Entity>Rethrower
    .fromTemplate(reconstructingFromStorageData, reconstructorFn)
    .execute(...reconstructorArgs);
}
