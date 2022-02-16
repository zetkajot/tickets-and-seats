import { ControllerRequest } from './controller-request';
import { ControllerResponse } from './controller-response';

export type ActionHandler = (request: ControllerRequest) => Promise<ControllerResponse>;
