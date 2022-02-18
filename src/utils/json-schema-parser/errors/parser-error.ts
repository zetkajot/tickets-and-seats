export default class ParserError extends Error {
  constructor() {
    super();
    this.name = 'Parser Error';
  }
}
