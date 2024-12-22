import { Either } from 'effect';
import { ParsingException } from './parsingException';

export class Year {
  private constructor(private readonly value: number) {}

  static parse(input: string): Either.Either<Year, ParsingException> {
    const year = Number.parseInt(input);
    if (Number.isNaN(year) || year < 0 || year > 99) {
      return Either.left(
        new ParsingException('Year should be between 0 and 99'),
      );
    }
    return Either.right(new Year(year));
  }

  toString(): string {
    return this.value.toString().padStart(2, '0');
  }

  equals(other: Year): boolean {
    if (!(other instanceof Year)) {
      return false;
    }
    return this.value === other.value;
  }
}
