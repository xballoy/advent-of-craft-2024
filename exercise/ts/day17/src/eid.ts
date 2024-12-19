import assert from 'node:assert';
import { Either, Match, pipe } from 'effect';
import { ParsingError } from './parsing-error';

type Strigifiable = {
  toString: () => string;
};

export class Gender implements Strigifiable {
  public static readonly Sloubi = new Gender('1');
  public static readonly Gagna = new Gender('2');
  public static readonly Catact = new Gender('3');

  private constructor(private readonly value: string) {
    this.value = value;
  }

  static parse(value: string): Either.Either<Gender, ParsingError> {
    return Match.value(value).pipe(
      Match.when(Gender.Sloubi.value, () => Either.right(Gender.Sloubi)),
      Match.when(Gender.Gagna.value, () => Either.right(Gender.Gagna)),
      Match.when(Gender.Catact.value, () => Either.right(Gender.Catact)),
      Match.orElse(() =>
        Either.left(new ParsingError(`Invalid gender: ${value}`)),
      ),
    );
  }

  toString(): string {
    return this.value;
  }
}

export class Year implements Strigifiable {
  private constructor(private readonly year: number) {}

  static fromInt(year: number): Year {
    return new Year(year);
  }

  static parse(value: string): Either.Either<Year, ParsingError> {
    const maybeYear = Number.parseInt(value);
    if (maybeYear >= 0 && maybeYear <= 99) {
      return Either.right(new Year(maybeYear));
    }
    return Either.left(new ParsingError(`Invalid year: ${value}`));
  }

  toString(): string {
    return this.year.toString().padStart(2, '0');
  }
}

export class SerialNumber implements Strigifiable {
  private constructor(private readonly serialNumber: number) {}

  static fromInt(serialNumber: number): SerialNumber {
    return new SerialNumber(serialNumber);
  }

  static parse(value: string): Either.Either<SerialNumber, ParsingError> {
    const maybeSerial = Number.parseInt(value);
    if (maybeSerial >= 0 && maybeSerial <= 999) {
      return Either.right(new SerialNumber(maybeSerial));
    }
    return Either.left(new ParsingError(`Invalid serial number: ${value}`));
  }

  toString(): string {
    return this.serialNumber.toString().padStart(3, '0');
  }
}

export class Key implements Strigifiable {
  private constructor(private readonly key: number) {}

  static from(gender: Gender, year: Year, serialNumber: SerialNumber): Key {
    const eidWithoutKey = `${gender.toString()}${year.toString()}${serialNumber.toString()}`;
    return new Key(97 - (Number.parseInt(eidWithoutKey) % 97));
  }

  static parse(
    eidWithoutKey: string,
    key: string,
  ): Either.Either<Key, ParsingError> {
    const expectedKey = 97 - (Number.parseInt(eidWithoutKey) % 97);
    if (expectedKey === Number.parseInt(key)) {
      return Either.right(new Key(expectedKey));
    }
    return Either.left(new ParsingError(`Invalid key: ${key}`));
  }

  toString(): string {
    return this.key.toString().padStart(2, '0');
  }
}

export class EID {
  private static Builder = class EIDBuilder {
    private gender: Gender | undefined;
    private year: Year | undefined;
    private serialNumber: SerialNumber | undefined;
    private key: Key | undefined;

    withGender(gender: Gender): this {
      this.gender = gender;
      return this;
    }

    withYear(year: Year): this {
      this.year = year;
      return this;
    }

    withSerialNumber(serialNumber: SerialNumber): this {
      this.serialNumber = serialNumber;
      return this;
    }

    withKey(key: Key): this {
      this.key = key;
      return this;
    }

    build(): EID {
      assert(this.gender);
      assert(this.year);
      assert(this.serialNumber);
      assert(this.key);

      return new EID({
        gender: this.gender,
        year: this.year,
        serialNumber: this.serialNumber,
        key: this.key,
      });
    }
  };

  private readonly value: string;

  private constructor({
    gender,
    year,
    serialNumber,
    key,
  }: {
    gender: Gender;
    year: Year;
    serialNumber: SerialNumber;
    key: Key;
  }) {
    this.value = `${gender.toString()}${year.toString()}${serialNumber.toString()}${key.toString()}`;
  }

  toString(): string {
    return this.value;
  }

  static parse(value: string): Either.Either<EID, ParsingError> {
    const builder = EID.builder();
    return pipe(
      EID.parseGender(value.slice(0, 1), builder),
      Either.flatMap((builder) => EID.parseYear(value.slice(1, 3), builder)),
      Either.flatMap((builder) =>
        EID.parseSerialNumber(value.slice(3, 6), builder),
      ),
      Either.flatMap((builder) =>
        EID.parseKey(value.slice(0, 6), value.slice(6, 8), builder),
      ),
      Either.map((builder) => {
        return builder.build();
      }),
    );
  }

  private static parseGender(
    value: string,
    builder: InstanceType<typeof EID.Builder>,
  ) {
    return Either.map(Gender.parse(value), (it) => builder.withGender(it));
  }

  private static parseYear(
    value: string,
    builder: InstanceType<typeof EID.Builder>,
  ) {
    return Either.map(Year.parse(value), (it) => builder.withYear(it));
  }

  private static parseSerialNumber(
    value: string,
    builder: InstanceType<typeof EID.Builder>,
  ) {
    return Either.map(SerialNumber.parse(value), (it) =>
      builder.withSerialNumber(it),
    );
  }

  private static parseKey(
    eidWithoutKey: string,
    value: string,
    builder: InstanceType<typeof EID.Builder>,
  ) {
    return Either.map(Key.parse(eidWithoutKey, value), (it) => {
      return builder.withKey(it);
    });
  }

  static builder() {
    return new EID.Builder();
  }
}
