export type ControllerRequest = {
  action: string,
  args: {
    name: string,
    value: string,
  }[],
};
