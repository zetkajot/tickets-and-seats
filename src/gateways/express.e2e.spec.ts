import request from 'supertest';
import { expect } from 'chai';
import path from 'node:path/win32';
import makeMariaDBStorageVendor from '../infrastracture/concrete/mariadb/make-mariadb-storage-vendor';
import ConfigSingleton from '../utils/config-singleton';
import ExpressGateway from './express/expres-gateway';
import parseSchema from '../controller/schema-parser/parse-schema';
import MariaDBStorageVendor from '../infrastracture/concrete/mariadb/mariadb-storage-vendor';
import defaultExpressRouteSchema from '../schemas/default-express-route-schema';
import Controller from '../controller/controller';
import startInTestEnvironment from '../infrastracture/concrete/mariadb/utils/start-in-test-environment';
import stopInTestEnvironment from '../infrastracture/concrete/mariadb/utils/stop-in-test-environment';

let expressApp: Express.Application;
let storageVendor: MariaDBStorageVendor;

describe('Express Gateway E2E tests', () => {
  before(async () => {
    storageVendor = makeMariaDBStorageVendor(ConfigSingleton.getConfig().mariadbConfig);
    const controllerSchema = parseSchema(path.join(__dirname, '..\\schemas\\controller_schema.json'));
    const controller = new Controller(storageVendor, controllerSchema);
    const gateway = new ExpressGateway(defaultExpressRouteSchema, controller);
    expressApp = gateway.expressApp;
    await startInTestEnvironment(storageVendor);
  });
  after(async () => {
    await stopInTestEnvironment(storageVendor);
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
      describe('With one or more parameters from \'name\', \'hallId\', \'startsAt\', \'endsAt\' missing', () => {
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
              .post('/event?name=event no 4&hallId=hall-id-1&startsAt=2020&endsAt=2019');
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
              .post('/event?name=event no 4&hallId=hall-id-1&startsAt=2020&endsAt=2021');
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
  describe('/ticket', () => {
    describe('GET', () => {
      describe('With \'id\' param not set', () => {
        it('Responds with error response indicating Invalid Request Error', async () => {
          const response = await request(expressApp)
            .get('/ticket');
          expect(response.statusCode).to.equal(400);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Request Error',
            errorMessage: '',
          });
        });
      });
      describe('With \'id\' param set to id of nonexistent ticket', () => {
        it('Responds with error response indicating Invalid Data Error', async () => {
          const response = await request(expressApp)
            .get('/ticket?id=non-existent-ticket-id');
          expect(response.statusCode).to.equal(404);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Entity you were looking for was not found!',
          });
        });
      });
      describe('with \'id\' param set to id of existing ticket', () => {
        it('Responds with stored ticket data', async () => {
          const response = await request(expressApp)
            .get('/ticket?id=ticket-id-1');
          expect(response.statusCode).to.equal(200);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: true,
            data: {
              ticketId: 'ticket-id-1',
              eventName: 'event no 2',
              hallName: 'hall no 3',
              startingDate: new Date('2013').toJSON(),
              seatNo: 1,
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
      describe('With \'id\' param set to id of nonexistent ticket', () => {
        it('Responds with error response indicating Invalid Data Error', async () => {
          const response = await request(expressApp)
            .delete('/ticket?id=non-existent-ticket-id');
          expect(response.statusCode).to.equal(404);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Entity you were looking for was not found!',
          });
        });
      });
      describe('with \'id\' param set to id of existing ticket', () => {
        it('Responds with deleted ticket data', async () => {
          const response = await request(expressApp)
            .delete('/ticket?id=ticket-id-2');
          expect(response.statusCode).to.equal(200);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: true,
            data: {
              eventId: 'event-id-2',
              ticketId: 'ticket-id-2',
              seatNo: 2,
            },
          });
        });
      });
    });
    describe('POST', () => {
      describe('With one or more parameters from \'eventId\', \'seatNo\' missing', () => {
        it('Responds with error response indicating Invalid Request Error', async () => {
          const response = await request(expressApp)
            .post('/ticket?eventId=event-id-3');
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
        describe('When \'eventId\' is set to id of nonexistent event', () => {
          it('Responds with InvalidDataError', async () => {
            const response = await request(expressApp)
              .post('/ticket?eventId=non-existent-event-id&seatNumber=1');

            expect(response.statusCode).to.equal(404);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.deep.equal({
              isOk: false,
              errorName: 'Invalid Data Error',
              errorMessage: 'Entity you were looking for was not found!',
            });
          });
        });
        describe('When \'eventId\' is set to id of closed event', async () => {
          const response = await request(expressApp)
            .post('/ticket?eventId=event-id-5&seatNumber=1');

          expect(response.statusCode).to.equal(404);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Event you are trying to interact with is closed for reservations!',
          });
        });
        describe('When seat with number \'seatNo\' is taken', async () => {
          const response = await request(expressApp)
            .post('/ticket?eventId=event-id-2&seatNumber=2');

          expect(response.statusCode).to.equal(409);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Seat is already taken!',
          });
        });
        describe('When seat with number \'seatNo\' does not exist', async () => {
          const response = await request(expressApp)
            .post('/ticket?eventId=event-id-2&seatNumber=99');

          expect(response.statusCode).to.equal(409);
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.body).to.deep.equal({
            isOk: false,
            errorName: 'Invalid Data Error',
            errorMessage: 'Seat does not exist!',
          });
        });
        describe('When params contain valid ticket data', () => {
          it('Responds with created ticket data', async () => {
            const response = await request(expressApp)
              .post('/ticket?eventId=event-id-5&seatNumber=1');

            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.data).to.deep.include({
              seatNo: 1,
              hallId: 'hall-id-2',
              eventId: 'event-id-5',
              eventName: 'event no 5',
              eventStartingDate: new Date('2032').toJSON(),
              eventEndingDate: new Date('2034').toJSON(),
            });
          });
        });
      });
    });
  });
});
