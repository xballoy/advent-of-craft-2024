import { Either } from 'effect';
import { ParsingException } from './parsingException';

export enum Sex {
  Sloubi = '1',
  Gagna = '2',
  Catact = '3',
}

export namespace Sex {
  export function parse(
    potentialSex: string,
  ): Either.Either<Sex, ParsingException> {
    switch (potentialSex) {
      case '1':
        return Either.right(Sex.Sloubi);
      case '2':
        return Either.right(Sex.Gagna);
      case '3':
        return Either.right(Sex.Catact);
      default:
        return Either.left(new ParsingException('Not a valid sex'));
    }
  }
}
