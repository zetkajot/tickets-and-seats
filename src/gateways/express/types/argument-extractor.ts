import { Request } from 'express';
import { ControllerRequestArguments } from '../../../controller/types/controller-request-arguments';

export type ArgumentExtractor = (request: Request) => ControllerRequestArguments;
