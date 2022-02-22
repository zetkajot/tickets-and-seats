import e from 'express';
import Controller from '../../controller/controller';
import { ControllerResponse } from '../../controller/types/controller-response';
import { ArgumentExtractor } from './types/argument-extractor';
import { HTTPErrorCodeMap } from './types/http-error-code-map';
import { RequestHandler } from './types/request-handler';

export default class ExpressActionHandler {
  constructor(private controller: Controller, private errorCodeMap: HTTPErrorCodeMap) {}

  makeRequestHandler(actionSignature: string, extractor: ArgumentExtractor): RequestHandler {
    const actionHook = this.controller.getActionHandler(actionSignature);
    return (async (req, res) => {
      const args = extractor(req);
      const result = await actionHook({ action: 'unused', args });
      if (result.isOk) {
        this.setOkResponse(result, res);
      } else {
        this.setFailResponse(result, res);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private setOkResponse(result: ControllerResponse & { isOk: true }, res: e.Response) {
    res.status(200);
    res.contentType('application/json');
    res.send(result);
  }

  private setFailResponse({ error }: ControllerResponse & { isOk: false }, res: e.Response) {
    const statusCode = this.lookupStatusCode(error);
    res.status(statusCode);
    res.contentType('application/json');
    res.send({
      isOk: false,
      errorName: error.name,
      errorMessage: error.message,
    });
  }

  private lookupStatusCode(error: Error & { subtype?: number }): number {
    // eslint-disable-next-line no-restricted-syntax
    for (const [name, value] of Object.entries(this.errorCodeMap)) {
      if (name === error.name) {
        if (typeof value === 'number') return value;
        // eslint-disable-next-line no-restricted-syntax
        for (const [subtype, subvalue] of Object.entries(value)) {
          if (+subtype === error.subtype) return subvalue;
        }
      }
    }
    return 500;
  }
}
