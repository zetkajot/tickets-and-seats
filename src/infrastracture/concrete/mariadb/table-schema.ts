const ticketSchema = 'CREATE TABLE IF NOT EXISTS Ticket ('
                       + 'id UUID NOT NULL UNIQUE PRIMARY KEY'
                       + 'eventid UUID NOT NULL'
                       + 'seatno MEDIUMINT NOT NULL'
                       + 'CONSTRAINT `fk_ticket_event`'
                           + 'FOREIGN KEY (eventid) REFERENCES Event (id)'
                   + ');';

const hallSchema = 'CREATE TABLE IF NOT EXISTS Hall ('
                     + 'id UUID NOT NULL UNIQUE PRIMARY KEY'
                     + 'name VARCHAR(255) NOT NULL'
                     + 'layout JSON NOT NULL'
                 + ');';

const eventSchema = 'CREATE TABLE IF NOT EXISTS Event ('
                      + 'id UUID NOT NULL UNIQUE PRIMARY KEY'
                      + 'name VARCHAR(255) NOT NULL'
                      + 'hallid UUID NOT NULL UNIQUE'
                      + 'startsat UNSIGNED INT NOT NULL'
                      + 'endsat UNSIGNED INT NOT NULL'
                      + 'isopen BOOLEAN NOT NULL'
                      + 'reservedseats JSON NOT NULL'
                      + 'CONSTRAINT `fk_event_hall`'
                          + 'FOREIGN KEY (hallid) REFERENCES Hall (id)'
                  + ');';

const tableSchema = {
  event: eventSchema,
  hall: hallSchema,
  ticket: ticketSchema,
};

export default tableSchema;
