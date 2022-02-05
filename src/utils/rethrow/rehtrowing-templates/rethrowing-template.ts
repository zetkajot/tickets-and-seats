export default interface RehtrowingTemplate {
  rehthrows: {
    matchingError: { new(...args: any[]): Error },
    rehtrowingFn: (error: Error) => Error
  }[],
}
