import { describe } from 'vitest';
import {
  OverflowException,
  SantaTravelCalculator,
} from '../src/travel/santaTravelCalculator';

describe('SantaTravelCalculator', () => {
  const SimpleCase = [
    [1, 1],
    [2, 3],
    [5, 31],
    [10, 1_023],
    [20, 1_048_575],
    [30, 1_073_741_823],
  ];
  const LargeCase = [
    [32, 4_294_967_295],
    [50, 1_125_899_906_842_623],
  ];

  describe('calculateTotalDistanceRecursively', () => {
    test.each(SimpleCase)(
      'should calculate the distance correctly for %d reindeers',
      (numberOfReindeers, expectedDistance) => {
        expect(
          SantaTravelCalculator.calculateTotalDistanceRecursively(
            numberOfReindeers,
          ),
        ).toBe(expectedDistance);
      },
    );

    test.each(LargeCase)(
      'should fail for numbers greater or equal to 32 (%d)',
      (numberOfReindeers) => {
        expect(() =>
          SantaTravelCalculator.calculateTotalDistanceRecursively(
            numberOfReindeers,
          ),
        ).toThrow(OverflowException);
      },
    );
  });

  describe('calculateTotalDistanceNotRecursively', () => {
    test.each([...SimpleCase, ...LargeCase])(
      'should calculate the distance correctly for %d reindeers',
      (numberOfReindeers, expectedDistance) => {
        expect(
          SantaTravelCalculator.calculateTotalDistanceNotRecursively(
            numberOfReindeers,
          ),
        ).toBe(expectedDistance);
      },
    );

    test.each(LargeCase)(
      'should not fail for numbers greater or equal to 32 (%d)',
      (numberOfReindeers) => {
        expect(() =>
          SantaTravelCalculator.calculateTotalDistanceNotRecursively(
            numberOfReindeers,
          ),
        ).not.toThrow(OverflowException);
      },
    );
  });
});
