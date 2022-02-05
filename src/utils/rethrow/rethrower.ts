import RehtrowingTemplate from './rehtrowing-templates/rethrowing-template';

type GenericFunction<Result> = (...args: any[]) => Result;

type ErrorConstructor<T extends Error> = { new(...args: any[]): T; };

export default class Rethrower<T, U extends GenericFunction<T>> {
  private rethrows: Map<ErrorConstructor<any>, (error: any) => any> = new Map();

  constructor(private targetFn: U) {}

  static fromTemplate<
  T,
  U extends GenericFunction<T>,
>(template: RehtrowingTemplate, targetFn: U): Rethrower<T, U> {
    const rethrower = <Rethrower<T, U>> new Rethrower(targetFn);
    template.rehthrows.forEach(({ matchingError, rehtrowingFn }) => {
      rethrower.addRethrow(matchingError, rehtrowingFn);
    });
    return rethrower;
  }

  execute(...args: Parameters<U>): T {
    try {
      return this.targetFn(...args);
    } catch (error) {
      this.catcher(error as Error);
      throw error;
    }
  }

  async asyncExecute(...args: Parameters<U>): Promise<T> {
    try {
      const fn = this.targetFn as unknown as (...x: any[]) => Promise<T>;
      return await fn(...args);
    } catch (error) {
      this.catcher(error as Error);
      throw error;
    }
  }

  private catcher(error: Error) {
    this.rethrows.forEach((rethrower, ErrConstructor) => {
      if (error instanceof ErrConstructor) {
        throw rethrower(error);
      }
    });
  }

  addRethrow<E1 extends Error, E2 extends Error>(
    errorConstructor: ErrorConstructor<E1>,
    rethrowingFunction: (error: E1) => E2,
  ): void {
    this.rethrows.set(errorConstructor, rethrowingFunction);
  }
}
