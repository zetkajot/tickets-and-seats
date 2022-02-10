import { Request } from 'express';
import { ControllerRequest } from '../../controllers/types/controller-request';

export default function makeControllerRequest(
  expressRequest: Request,
  actionName: string,
): ControllerRequest {
  const args = getArgsFromQuery(expressRequest.query);
  return {
    action: actionName,
    args,
  };
}

function getArgsFromQuery(query: object): { name: string, value: string }[] {
  const args: { name: string, value: string }[] = [];
  Object.entries(query).forEach(([name, value]) => {
    args.push({ name, value });
  });
  return args;
}
