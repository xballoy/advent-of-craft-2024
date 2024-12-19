import { Either } from 'effect';
import fc from 'fast-check';
import { EID, Gender, Key, SerialNumber, Year } from '../src/eid';

const GenderGenerator = fc.constantFrom(
  Gender.Sloubi,
  Gender.Gagna,
  Gender.Catact,
);
const YearGenerator = fc
  .integer({ min: 0, max: 99 })
  .map((year) => Year.fromInt(year));
const SerialNumberGenerator = fc
  .integer({ min: 0, max: 999 })
  .map((serialNumber) => SerialNumber.fromInt(serialNumber));

const ValidEID = fc
  .record({
    gender: GenderGenerator,
    year: YearGenerator,
    serialNumber: SerialNumberGenerator,
  })
  .map(({ gender, year, serialNumber }) => {
    return EID.builder()
      .withGender(gender)
      .withYear(year)
      .withSerialNumber(serialNumber)
      .withKey(Key.from(gender, year, serialNumber))
      .build();
  });

describe('EID', () => {
  test('should satisfy the property parse(eid.toString()) == eid.toString()', () => {
    fc.assert(
      fc.property(ValidEID, (eid) => {
        const result = EID.parse(eid.toString());
        Either.match(result, {
          onRight: (parsed) =>
            expect(parsed.toString()).toEqual(eid.toString()),
          onLeft: (error) => fail(error.message),
        });
      }),
    );
  });
});
