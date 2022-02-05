import { Request } from 'express';
import { ControllerRequest } from '../../controllers/types/controller-request';

export default function makeControllerRequest(expressRequest: Request): ControllerRequest {
  const action = expressRequest.path.replace('/', '');
  const args = getArgsFromQuery(expressRequest.query);
  return {
    action,
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
