export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParsingError';
    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}
