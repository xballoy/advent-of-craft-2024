import { bench } from 'vitest';
import { SantaTravelCalculator } from '../src/travel/santaTravelCalculator';

describe('SantaTravelCalculator Bench', () => {
  bench('Calculate distance recursively 30 reindeer', () => {
    SantaTravelCalculator.calculateTotalDistanceRecursively(30);
  });

  bench('Calculate distance non recursively 30 reindeer', () => {
    SantaTravelCalculator.calculateTotalDistanceNotRecursively(30);
  });
});
