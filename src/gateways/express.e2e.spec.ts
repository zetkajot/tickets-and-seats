import request from 'supertest';
import { expect } from 'chai';
import makeMariaDBStorageVendor from '../infrastracture/concrete/mariadb/make-maria-db-storage-vendor';
import ConfigSingleton from '../utils/config-singleton';
import ExpressGateway from './express/expres-gateway';
import defaultRouteMapper from './express/default-route-mapper';
import makeActionsFromSchema from '../controllers/make-actions-from-schema';
import makeController from '../controllers/make-controller';
import defaultActionSchema from '../controllers/action-schemas/default-action-schema';

let expressApp: Express.Application;

describe('Express Gateway E2E tests', () => {
  before(async () => {
    expressApp = (await setupExpressGateway()).expressApp;
  });
  describe('/event', () => {
    describe('GET', () => {
      describe('With \'id\' param not set', () => {
        it('Responds with error response indicating Invalid Request Error', async () => {
          const response = await request(expressApp)
            .get('/event');
          expect(response.statusCode).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Request Error',
            errorMessage: '',
          });
        });
      });
      describe('With \'id\' param set to id of nonexistent event', () => {
        it('Responds with error response indicating Invalid Data Error', async () => {
          const response = await request(expressApp)
            .get('/event?id=non-existent-event-id');
          expect(response.statusCode).to.equal(404);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Entity you were looking for was not found!',
          });
        });
      });
      describe('with \'id\' param set to id of existing event', () => {
        it('Responds with stored event data', async () => {
          const response = await request(expressApp)
            .get('/event?id=event-id-1');
          expect(response.statusCode).to.equal(200);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: true,
            data: {
              eventId: 'event-id-1',
              eventName: 'event no 1',
              hallName: 'hall no 1',
              startingDate: new Date('2020').toJSON(),
              endingDate: new Date('2021').toJSON(),
              isOpen: false,
            },
          });
        });
      });
    });
    describe('DELETE ', () => {
      describe('With \'id\' param not set', () => {
        it('Responds with error response indicating Invalid Request Error', async () => {
          const response = await request(expressApp)
            .delete('/event');
          expect(response.statusCode).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Request Error',
            errorMessage: '',
          });
        });
      });
      describe('With \'id\' param set to id of nonexistent event', () => {
        it('Responds with error response indicating Invalid Data Error', async () => {
          const response = await request(expressApp)
            .delete('/event?id=non-existent-event-id');
          expect(response.statusCode).to.equal(404);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Entity you were looking for was not found!',
          });
        });
      });
      describe('with \'id\' param set to id of existing event', () => {
        it('Responds with deleted event data', async () => {
          const response = await request(expressApp)
            .delete('/event?id=event-id-3');
          expect(response.statusCode).to.equal(200);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: true,
            data: {
              eventId: 'event-id-3',
              name: 'event no 3',
              hallId: 'hall-id-2',
            },
          });
        });
        it('Deleted event can no longer be found', async () => {
          const response = await request(expressApp)
            .get('/event?id=event-id-3');
          expect(response.statusCode).to.equal(404);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Entity you were looking for was not found!',
          });
        });
      });
    });
    describe('POST', () => {
      describe('With one or more parameters from \'name\', \'hallId\', \'startingDate\', \'endingDate\' missing', () => {
        it('Responds with error response indicating Invalid Request Error', async () => {
          const response = await request(expressApp)
            .post('/event?id=event-id-3');
          expect(response.statusCode).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Request Error',
            errorMessage: '',
          });
        });
      });
      describe('With all aforementioned params set', () => {
        describe('When params contain invalid event data', () => {
          it('Responds with error response indicating Invalid Data Error', async () => {
            const response = await request(expressApp)
              .post('/event?name=event no 4&hallId=hall-id-1&startingDate=2020&endingDate=2019');
            expect(response.statusCode).to.equal(422);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.deep.equal({
              isOk: false,
              errorName: 'Invalid Data Error',
              errorMessage: 'Event data you provided is invalid!',
            });
          });
        });
        describe('When params contain valid event data', () => {
          it('Responds with created event data', async () => {
            const response = await request(expressApp)
              .post('/event?name=event no 4&hallId=hall-id-1&startingDate=2020&endingDate=2021');
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.nested.include({
              'data.eventName': 'event no 4',
            });
          });
        });
      });
    });
    describe('/event/seats', () => {
      describe('GET with \'id\' param set to id of existing event', () => {
        describe('With \'id\' param not set', () => {
          it('Responds with error response indicating Invalid Request Error', async () => {
            const response = await request(expressApp)
              .get('/event/seats?');
            expect(response.statusCode).to.equal(400);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.deep.equal({
              isOk: false,
              errorName: 'Invalid Request Error',
              errorMessage: '',
            });
          });
        });
        describe('With \'id\' param set to ', () => {
          describe('id of nonexistent event', () => {
            it('Responds with error response indicating Invalid Data Error', async () => {
              const response = await request(expressApp)
                .get('/event/seats?id=non-existent-event-id');
              expect(response.statusCode).to.equal(404);
              expect(response.headers['content-type']).to.include('application/json');
              expect(response.body).to.deep.equal({
                isOk: false,
                errorName: 'Invalid Data Error',
                errorMessage: 'Entity you were looking for was not found!',
              });
            });
          });
        });
        describe('id of existing event', () => {
          it('Responds with seat information for given event', async () => {
            const response = await request(expressApp)
              .get('/event/seats?id=event-id-1');
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.deep.equal({
              isOk: true,
              data: {
                eventId: 'event-id-1',
                hallId: 'hall-id-1',
                reservedSeats: [],
                freeSeats: [],
              },
            });
          });
        });
      });
    });
    describe('/event/open', () => {
      describe('PUT', () => {
        describe('With \'id\' param not set', () => {
          it('Responds with error response indicating Invalid Request Error', async () => {
            const response = await request(expressApp)
              .put('/event/open');
            expect(response.statusCode).to.equal(400);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.deep.equal({
              isOk: false,
              errorName: 'Invalid Request Error',
              errorMessage: '',
            });
          });
        });
        describe('With \'id\' param set to', () => {
          describe('nonexistent event', () => {
            it('Responds with error response indicating Invalid Data Error', async () => {
              const response = await request(expressApp)
                .put('/event/open?id=non-existent-event-id');
              expect(response.statusCode).to.equal(404);
              expect(response.headers['content-type']).to.include('application/json');
              expect(response.body).to.deep.equal({
                isOk: false,
                errorName: 'Invalid Data Error',
                errorMessage: 'Entity you were looking for was not found!',
              });
            });
          });
          describe('already open event', () => {
            it('Responds with error response indicating Invalid Data Error', async () => {
              const response = await request(expressApp)
                .put('/event/open?id=event-id-2');
              expect(response.statusCode).to.equal(409);
              expect(response.headers['content-type']).to.include('application/json');
              expect(response.body).to.deep.equal({
                isOk: false,
                errorName: 'Invalid Data Error',
                errorMessage: 'Event you are trying to interact with is open for reservations!',
              });
            });
          });
          describe('closed event', () => {
            it('Responds with opened event data', async () => {
              const response = await request(expressApp)
                .put('/event/open?id=event-id-1');
              expect(response.statusCode).to.equal(200);
              expect(response.headers['content-type']).to.include('application/json');
              expect(response.body).to.deep.equal({
                isOk: true,
                data: {
                  eventId: 'event-id-1',
                  eventName: 'event no 1',
                  isOpenForReservations: true,
                },
              });
            });
          });
        });
      });
    });
    describe('/event/close', () => {
      describe('PUT', () => {
        describe('With \'id\' param not set', () => {
          it('Responds with error response indicating Invalid Request Error', async () => {
            const response = await request(expressApp)
              .put('/event/close');
            expect(response.statusCode).to.equal(400);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.deep.equal({
              isOk: false,
              errorName: 'Invalid Request Error',
              errorMessage: '',
            });
          });
        });
        describe('With \'id\' param set to', () => {
          describe('nonexistent event', () => {
            it('Responds with error response indicating Invalid Data Error', async () => {
              const response = await request(expressApp)
                .put('/event/close?id=non-existent-event-id');
              expect(response.statusCode).to.equal(404);
              expect(response.headers['content-type']).to.include('application/json');
              expect(response.body).to.deep.equal({
                isOk: false,
                errorName: 'Invalid Data Error',
                errorMessage: 'Entity you were looking for was not found!',
              });
            });
          });
          describe('already closed event', () => {
            it('Responds with error response indicating Invalid Data Error', async () => {
              const response = await request(expressApp)
                .put('/event/close?id=event-id-4');
              expect(response.statusCode).to.equal(409);
              expect(response.headers['content-type']).to.include('application/json');
              expect(response.body).to.deep.equal({
                isOk: false,
                errorName: 'Invalid Data Error',
                errorMessage: 'Event you are trying to interact with is closed for reservations!',
              });
            });
          });
          describe('closed event', () => {
            it('Responds with closeed event data', async () => {
              const response = await request(expressApp)
                .put('/event/close?id=event-id-1');
              expect(response.statusCode).to.equal(200);
              expect(response.headers['content-type']).to.include('application/json');
              expect(response.body).to.deep.equal({
                isOk: true,
                data: {
                  eventId: 'event-id-1',
                  eventName: 'event no 1',
                  isOpenForReservations: false,
                },
              });
            });
          });
        });
      });
    });
    describe('/event/find', () => {
      describe('GET', () => {
        describe('With no params', () => {
          it('Responds with data of all stored events', async () => {
            const response = await request(expressApp)
              .get('/event/find');
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.data).to.include.deep.members([
              {
                eventId: 'event-id-1',
                eventName: 'event no 1',
                hallId: 'hall-id-1',
                startingDate: new Date('2020').toJSON(),
                endingDate: new Date('2021').toJSON(),
                isOpen: false,
              },
              {
                eventId: 'event-id-2',
                eventName: 'event no 2',
                hallId: 'hall-id-3',
                startingDate: new Date('2013').toJSON(),
                endingDate: new Date('2019').toJSON(),
                isOpen: true,
              },
              {
                eventId: 'event-id-4',
                eventName: 'event no 4',
                hallId: 'hall-id-2',
                startingDate: new Date('2032').toJSON(),
                endingDate: new Date('2034').toJSON(),
                isOpen: false,
              },
            ]);
          });
        });
        describe('With one or more params set', () => {
          it('Responds with data of matching stored events', async () => {
            const response = await request(expressApp)
              .get('/event/find?name=event no 1');
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.data).to.deep.include({
              eventId: 'event-id-1',
              eventName: 'event no 1',
              hallId: 'hall-id-1',
              startingDate: new Date('2020').toJSON(),
              endingDate: new Date('2021').toJSON(),
              isOpen: false,
            });
          });
        });
      });
    });
  });
  describe('/hall', () => {
    describe('GET', () => {
      describe('With \'id\' param not set', () => {
        it('Responds with error response indicating Invalid Request Error', async () => {
          const response = await request(expressApp)
            .get('/hall');
          expect(response.statusCode).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Request Error',
            errorMessage: '',
          });
        });
      });
      describe('With \'id\' param set to id of nonexistent hall', () => {
        it('Responds with error response indicating Invalid Data Error', async () => {
          const response = await request(expressApp)
            .get('/hall?id=non-existent-hall-id');
          expect(response.statusCode).to.equal(404);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Entity you were looking for was not found!',
          });
        });
      });
      describe('with \'id\' param set to id of existing hall', () => {
        it('Responds with stored hall data', async () => {
          const response = await request(expressApp)
            .get('/hall?id=hall-id-1');
          expect(response.statusCode).to.equal(200);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: true,
            data: {
              hallId: 'hall-id-1',
              hallName: 'hall no 1',
              seatLayout: [],
            },
          });
        });
      });
    });
    describe('DELETE ', () => {
      describe('With \'id\' param not set', () => {
        it('Responds with error response indicating Invalid Request Error', async () => {
          const response = await request(expressApp)
            .delete('/hall');
          expect(response.statusCode).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Request Error',
            errorMessage: '',
          });
        });
      });
      describe('With \'id\' param set to id of nonexistent hall', () => {
        it('Responds with error response indicating Invalid Data Error', async () => {
          const response = await request(expressApp)
            .delete('/hall?id=non-existent-hall-id');
          expect(response.statusCode).to.equal(404);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Entity you were looking for was not found!',
          });
        });
      });
      describe('with \'id\' param set to id of existing hall', () => {
        it('Responds with deleted hall data', async () => {
          const response = await request(expressApp)
            .delete('/hall?id=hall-id-4');
          expect(response.statusCode).to.equal(200);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: true,
            data: {
              hallId: 'hall-id-4',
              hallName: 'hall no 4',
            },
          });
        });
      });
    });
    describe('POST', () => {
      describe('With one or more parameters from \'name\', \'seatLayout\' missing', () => {
        it('Responds with error response indicating Invalid Request Error', async () => {
          const response = await request(expressApp)
            .post('/hall?name=hall with missing params');
          expect(response.statusCode).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Request Error',
            errorMessage: '',
          });
        });
      });
      describe('With all aforementioned params set', () => {
        describe('When params contain invalid hall data', () => {
          it('Responds with error response indicating Invalid Data Error', async () => {
            const response = await request(expressApp)
              .post('/hall?name=hall with invalid layout&seatLayout=[{"seatNo":0, "seatPosition": {"x": 1, "y": 2}}, {"seatNo":0, "seatPosition": {"x": 1, "y": 2}}]');
            expect(response.statusCode).to.equal(422);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.deep.equal({
              isOk: false,
              errorName: 'Invalid Data Error',
              errorMessage: 'Hall data you provided is invalid!',
            });
          });
        });
        describe('When params contain valid hall data', () => {
          it('Responds with created hall data', async () => {
            const response = await request(expressApp)
              .post('/hall?name=my hall&seatLayout=[{"seatNo":0, "seatPosition": {"x": 1, "y": 2}}]');
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.data).to.deep.include({
              hallName: 'my hall',
              seatLayout: [{
                seatNo: 0,
                seatPosition: {
                  x: 1,
                  y: 2,
                },
              }],
            });
          });
        });
      });
    });
    describe('/hall/find', () => {
      describe('GET', () => {
        describe('With no params', () => {
          it('Responds with data of all stored halls', async () => {
            const response = await request(expressApp)
              .get('/hall/find');
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.data).to.include.deep.members([
              {
                hallName: 'hall no 1',
                hallId: 'hall-id-1',
              },
              {
                hallName: 'hall no 2',
                hallId: 'hall-id-2',
              },
              {
                hallName: 'hall no 3',
                hallId: 'hall-id-3',
              },
            ]);
          });
        });
        describe('With one or more params set', () => {
          it('Responds with data of matching stored halls', async () => {
            const response = await request(expressApp)
              .get('/hall/find?name=hall no 1');
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.data).to.deep.include({
              hallName: 'hall no 1',
              hallId: 'hall-id-1',
            });
          });
        });
      });
    });
  });
});

async function setupExpressGateway(): Promise<ExpressGateway> {
  const expressGateway = new ExpressGateway(defaultRouteMapper);
  const storageVendor = await makeMariaDBStorageVendor(ConfigSingleton.getConfig().mariadbConfig);
  const actions = makeActionsFromSchema(defaultActionSchema, storageVendor);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const controller = makeController(actions, expressGateway);

  return expressGateway;
}
