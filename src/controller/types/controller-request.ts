import { ControllerRequestArguments } from './controller-request-arguments';

export type ControllerRequest = {
  action: string,
  args: ControllerRequestArguments,
};
