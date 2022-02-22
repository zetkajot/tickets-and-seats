export type HTTPErrorCodeMap = {
  [errorName: string]: number | {
    [errorSubtype: number]: number,
  },
};
