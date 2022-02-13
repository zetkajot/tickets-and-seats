import { ControllerRequest } from './controller-request';
import { ControllerResponse } from './controller-response';

export type Controller<T extends { [k: string]: any }> = {
  [k in `handle${Capitalize<keyof T & string>}`]: (req: ControllerRequest) => Promise<ControllerResponse>;
};
