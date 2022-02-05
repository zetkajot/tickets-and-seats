import UseCase from '../../use-cases/use-case';
import { ControllerRequest } from './controller-request';

export type UseCaseConstructor = { new(...args: any): UseCase<any, any> };

export type ActionSchema = {
  actionName: string,
  targetUseCase: UseCaseConstructor,
  convertRequestToInput: <UseCaseInput>(request: ControllerRequest) => UseCaseInput,
}[];
