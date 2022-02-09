const ticketSchema = 'CREATE TABLE IF NOT EXISTS Ticket ('
                       + 'id CHAR(36) NOT NULL UNIQUE PRIMARY KEY,'
                       + 'eventid CHAR(36) NOT NULL,'
                       + 'seatno MEDIUMINT NOT NULL,'
                       + 'CONSTRAINT `fk_ticket_event`'
                           + 'FOREIGN KEY (eventid) REFERENCES Event (id)'
                   + ');';

const hallSchema = 'CREATE TABLE IF NOT EXISTS Hall ('
                     + 'id CHAR(36) NOT NULL UNIQUE PRIMARY KEY,'
                     + 'name VARCHAR(255) NOT NULL,'
                     + 'layout JSON NOT NULL'
                 + ');';

const eventSchema = 'CREATE TABLE IF NOT EXISTS Event ('
                      + 'id CHAR(36) NOT NULL UNIQUE PRIMARY KEY,'
                      + 'name VARCHAR(255) NOT NULL,'
                      + 'hallid CHAR(36) NOT NULL,'
                      + 'startsat INT UNSIGNED NOT NULL,'
                      + 'endsat INT UNSIGNED NOT NULL,'
                      + 'isopen BOOLEAN NOT NULL,'
                      + 'reservedseats JSON NOT NULL,'
                      + 'CONSTRAINT `fk_event_hall`'
                          + 'FOREIGN KEY (hallid) REFERENCES Hall (id)'
                  + ');';

const tableSchema = {
  event: eventSchema,
  hall: hallSchema,
  ticket: ticketSchema,
};

export default tableSchema;
