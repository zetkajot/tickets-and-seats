# Tickets and Seats
Simple app to manage creating events and booking seats and my shot at creating software based on Clean Architecture.
### **Feature overview**
  - Create *Events* at given venues(*Halls*)
  - Give each *Hall* 2D layout of numbered seats
  - Issue *Tickets* for *Events*
  - Keep track of reserved and free seats at each *Event*
## Installation
*Those instructions apply to default version which uses MariaDB as a storage and Express as a gateway*

*For quick look you can use live version(with HTML API specification) [here](http://tickets.kaczka.xyz/).*  

### Requirements
- Node >= 16
- Access to MariaDB server (10.6 recommended)
### Installation steps:
#### 1. Clone this repository
```
git clone https://github.com/zetkajot/tickets-and-seats.git
```
#### 2. Install dependencies
```
npm install
```
#### 3. Build the project
```
npm run build
```
#### 4. Create `.env` file in projects main directory(i. e. where `package.json` resides) with following content:
```
MARIADB_HOST="MariaDB server address"
MARIADB_PORT="MariaDB server Port"
MARIADB_USER="MariaDB username"
MARIADB_PASS="MariaDB password"
MARIADB_DB="Database in MariaDB Server to use"
EXPRESS_PORT="Port for the app to listen on"
```
#### 4. Start the app
```
npm start
```
### How to make server use HTTPS?
#### 1. Create `/ssl` directory in projects main directory

#### 2. Copy your certificate and private key into the newly created `/ssl` dir naming them `certificate.crt` and `private.key` accordingly 

#### 3. Append following line to `.env` file
```
EXPRESS_SECURE_PORT="Desired HTTPS listening port"
```

#### 4. Start the app
# The Intestines
## Overview
App consists of following parts:
### Domain
Place where **Bussiness Rules** (*implementation indepentent behaviour*) are defined. 
They are expressed in form of **Entities** (*Sets of data and logic characterized by one or more domain-wide unique properties e.g. their ID*).
Right next to them reside **Value Objects** (*Sets of data and logic which are not unique*) and **Pseudo Entities**(*Sets of data without any associated logic which are characterized by one or more domain-wide unique properties*). 

*Event* and *Hall* are **Entities** - they have their own logic which enforces **Bussiness Rules** (*e.g. you cannot reserve seats in event that is closed for reservations*) and have domain-wide unique properties(*ID for both of them*).

*SeatLayout* is a **Value Object** - it has its own logic which prevents it from having two seats with the same number, but it is not unique, i.e. two *SeatLayouts* with the same seat numbers and positions are interchangeable.

*Ticket* is an example of **Pseudo Entity** - it has no logic(it is basically set of 3 values) but it is uniquely characterized by its ID. 
### Use cases
Here interaction with and between members of Domain Layer is orchestrated. It can be visualized as hands which pull the strings of one or more puppets. Each use case takes some data as an input, initializes some Entities with it, interacts with them, then converts result of those interactions to some other data and outputs it.
### Storage Vendor
Provider of persistence. In other words, its a toy chest for hands mentioned earlier that allows them to store and retrieve puppets to use in later interactions.

Storage Vendor provieds interface for **creating**, **saving** and **deleting** following types of data:
- *StoredHallData*
- *StoredTicketData*
- *StoredEventData*
  
Each of them can be used to reconstruct corresponding Entities (and Pseudo Entity in case of *StoredTicketData*). 
### Controller
This is the point where user requests are converted into data that will be then used to invoke desired use cases.

Right now it also serves the purpose of **Presenter** which takes the output data produced by the use cases and translates it into user-friendly format.
### Gateway
The outermost part which provides user interface. User interface can take form of REST API, GUI, TCP server, etc. It converts user actions(e.g. button press or HTTP request) into request understood by controller and then, presents controller response to user(via e.g. sending e-mail or UDP packet).
## Exemplified operation
For the purpose of this example let's assume that this app is used as an seat reservations service for some cinema. Also, let's say that gateway takes form of graphical interface displayed on some standalone POS. Application data is stored using local filesystem.

1. User taps on 'View available seats' on 'The Example Movie' page. 
2. Gateway (GUI) prepares controller request knowing that tap on button with ID *'get-seats'* corresponds to *'get-event-seats'* action and that it (button) was displayed on page for movie with ID *'movie-id-1389'*
3. Gateway sends to controller following message:
   ```javascript
   {
     action: 'some-action',
     args: [
       {
         name: 'eventId',
         value: 'movie-id-1389'
       }
     ]
   }
   ```
4. Controller converts recieved request into input accepted by `execute({eventId: string})` method on `GetSeatsInfo` use case.
5. Use cases calls `findEvent` method on `FileSystemStorageVendor` to find event data matching given ID.
6. Using recieved `StoredEventData` it calls `findHall` to find related hall data.
7. Use case reconstructs `Event` and `Hall` entities using previously recieved data.
8. Using information stored in `Event.reservedSeats` and `Hall.layout` use case prepares following output:
    ```javascript
    {
      eventId: 'movie-id-1389',
      hallId: 'hall-3F',
      freeSeats: [...],
      reservedSeats: [...].
    }
    ```
9. Controler (which serves the function of presenter) which previously invoked that use case uses its output to construct response:
   ```javascript
   {
     isOk: true,
     data: {
       eventId: movie_id-1389,
       hallId: 'hall-3F',
       freeSeats: [...],
       reservedSeats: [...],
     }
   }
   ```
10. GUI draws 2D layout of hall, marking free seats as green and reserved ones as red.
