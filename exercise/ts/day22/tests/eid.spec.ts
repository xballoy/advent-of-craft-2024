import { Either } from 'effect';
import fc, { sample } from 'fast-check';
import { EID } from '../src/eid/eid';
import { SerialNumber } from '../src/eid/serialNumber';
import { Sex } from '../src/eid/sex';
import { Year } from '../src/eid/year';

const yearGenerator = fc
  .integer()
  .filter((x) => x >= 0 && x <= 99)
  .map((x) => Year.parse(x.toString()))
  .map((year) => Either.getOrThrow(year));

const serialNumberGenerator = fc
  .integer()
  .filter((x) => x >= 1 && x <= 999)
  .map((x) => SerialNumber.parse(x.toString()))
  .map((serialNumber) => Either.getOrThrow(serialNumber));

const eidGenerator = fc
  .record({
    sex: fc.constantFrom(Sex.Sloubi, Sex.Gagna, Sex.Catact),
    year: yearGenerator,
    serialNumber: serialNumberGenerator,
  })
  .map(({ sex, year, serialNumber }) => new EID(sex, year, serialNumber));

describe('EID', () => {
  test('round tripping', () => {
    fc.assert(
      fc.property(eidGenerator, (validEID) => {
        const parsedEID = EID.parse(validEID.toString());

        Either.match(parsedEID, {
          onRight: (eid) => {
            expect(eid.equals(validEID)).toBeTruthy();
          },
          onLeft: (e) => {
            throw new Error(`Expected valid EID, got ${e.message}`);
          },
        });
      }),
    );
  });

  test('invalid EID can never be parsed', () => {
    fc.assert(
      fc.property(eidGenerator, mutantGenerator, (validEID, mutator) => {
        const mutated = mutator.mutate(validEID);
        const parsed = EID.parse(mutated);
        Either.match(parsed, {
          onRight: (eid) => {
            throw new Error(`Expected invalid EID, got ${eid.toString()}`);
          },
          onLeft: (e) => {
            expect(e).toBeTruthy();
          },
        });
      }),
    );
  });
});

class Mutator {
  constructor(
    public name: string,
    private func: (eid: EID) => fc.Arbitrary<string>,
  ) {}

  mutate(eid: EID): string {
    // biome-ignore lint/style/noNonNullAssertion: we assume we have at least one value in our tests
    return sample(this.func(eid)).at(0)!;
  }
}

const tooShortEidMutator: Mutator = new Mutator(
  'too short mutator',
  (eid: EID) =>
    fc.integer({ min: 0, max: eid.toString().length - 1 }).map((position) => {
      return eid
        .toString()
        .split('')
        .filter((_, i) => i !== position)
        .join('');
    }),
);
const tooLongEidMutator: Mutator = new Mutator('too long mutator', (eid: EID) =>
  fc.char().map((char) => {
    return eid.toString() + char;
  }),
);
const invalidSexMutator: Mutator = new Mutator(
  'invalid sex mutator',
  (eid: EID) =>
    fc
      .char()
      // @ts-ignore
      .filter((char) => ![Sex.Sloubi, Sex.Gagna, Sex.Catact].includes(char))
      .map((char) => {
        return char + eid.toString().substring(1, 8);
      }),
);
const invalidYearMutator: Mutator = new Mutator(
  'invalid year mutator',
  (eid: EID) =>
    fc
      .string({ minLength: 2, maxLength: 2 })
      .filter((year) => Number.isNaN(Number.parseInt(year)))
      .map(
        (year) =>
          eid.toString().substring(0, 1) + year + eid.toString().substring(3),
      ),
);
const invalidSerialMutator: Mutator = new Mutator(
  'invalid serial mutator',
  (eid: EID) => {
    return fc
      .string({ minLength: 3, maxLength: 3 })
      .filter((serial) => Number.isNaN(Number.parseInt(serial)))
      .map(
        (serial) =>
          eid.toString().substring(0, 3) + serial + eid.toString().substring(6),
      );
  },
);

const mutantGenerator: fc.Arbitrary<Mutator> = fc.constantFrom(
  tooShortEidMutator,
  tooLongEidMutator,
  invalidSexMutator,
  invalidYearMutator,
  invalidSerialMutator,
);
