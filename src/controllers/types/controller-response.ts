type ControllerOkResponse = {
  isOk: true,
  data: object,
};

type ControllerErrorResponse = {
  isOk: false,
  errorName: string,
  errorMessage: string,
};

export type ControllerResponse = ControllerOkResponse | ControllerErrorResponse;
