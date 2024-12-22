import { Either, pipe } from 'effect';
import { ParsingException } from './parsingException';
import { SerialNumber } from './serialNumber';
import { Sex } from './sex';
import { Year } from './year';

export class EID {
  constructor(
    private readonly sex: Sex,
    private readonly year: Year,
    private readonly serialNumber: SerialNumber,
  ) {}

  static parse(potentialEID: string): Either.Either<EID, ParsingException> {
    return pipe(
      Sex.parse(potentialEID.substring(0, 1)),
      Either.flatMap((sex) => {
        return pipe(
          Year.parse(potentialEID.substring(1, 3)),
          Either.flatMap((year) => {
            return pipe(
              SerialNumber.parse(potentialEID.substring(3, 6)),
              Either.flatMap((serialNumber) => {
                const eid = new EID(sex, year, serialNumber);
                return eid.checkKey(potentialEID.substring(6))
                  ? Either.right(eid)
                  : Either.left(new ParsingException('Invalid key'));
              }),
            );
          }),
        );
      }),
    );
  }

  private checkKey(potentialKey: string): boolean {
    const key = Number.parseInt(potentialKey);
    return !Number.isNaN(key) && this.key() === key;
  }

  private stringWithoutKey(): string {
    return `${this.sex}${this.year}${this.serialNumber}`;
  }

  private toLong(): number {
    return Number.parseInt(
      this.sex.toString() + this.year + this.serialNumber.toString(),
    );
  }

  key(): number {
    return 97 - (this.toLong() % 97);
  }

  toString(): string {
    return this.stringWithoutKey() + this.key().toString().padStart(2, '0');
  }

  equals(other: EID): boolean {
    if (!(other instanceof EID)) {
      return false;
    }
    return (
      this.sex === other.sex &&
      this.year.equals(other.year) &&
      this.serialNumber.equals(other.serialNumber)
    );
  }
}
