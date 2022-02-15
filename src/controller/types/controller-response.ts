type ControllerOkResponse = {
  isOk: true,
  data: object,
};

type ControllerErrorResponse = {
  isOk: false,
  error: Error,
};

export type ControllerResponse = ControllerOkResponse | ControllerErrorResponse;
