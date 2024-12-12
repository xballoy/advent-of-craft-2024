import * as fs from 'node:fs';
import * as path from 'node:path';
import { Building } from '../src/delivery/building';

describe('Building', () => {
  test.each([
    ['1', 0],
    ['2', 3],
    ['3', -1],
    ['4', 53],
    ['5', -3],
    ['6', 2920],
  ])(
    'returns the correct floor number based on instructions in file %s',
    (fileName, expectedFloor) => {
      const instructions = fs.readFileSync(
        path.join(__dirname, `deliveries/${fileName}.txt`),
        'utf-8',
      );
      const result = Building.whichFloor(instructions);
      expect(result).toBe(expectedFloor);
    },
  );
});
