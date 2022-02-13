import { ControllerRequest } from '../../controllers/types/controller-request';
import { ControllerResponse } from '../../controllers/types/controller-response';

export default interface Gateway {
  addPointOfInteraction(
    actionName: string,
    actionHandler: (req: ControllerRequest) => Promise<ControllerResponse>,
  ): void;
}
