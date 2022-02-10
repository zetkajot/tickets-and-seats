import { expect } from 'chai';
import { Request } from 'express';
import makeControllerRequest from './make-controller-request';

const exampleRequest = {
  path: '/action-name',
  query: {
    param1: 'value1',
    param2: 'value2',
  },
} as unknown as Request;

describe('makeControllerRequest test suite', () => {
  describe('When provided with express request', () => {
    it('Converts \'query\' to \'args\' in ControllerRequest', () => {
      const controllerRequest = makeControllerRequest(exampleRequest, 'some action');

      expect(controllerRequest)
        .to.have.property('args')
        .which.deep.equals([
          {
            name: 'param1',
            value: 'value1',
          }, {
            name: 'param2',
            value: 'value2',
          },
        ]);
    });
  });
});
