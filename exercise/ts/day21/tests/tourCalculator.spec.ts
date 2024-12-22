import fc from 'fast-check';
import {
  NewTourCalculator,
  type Step,
  TourCalculator,
} from '../src/tour/tourCalculator';

const TimeGenerator = fc
  .record({
    hour: fc.integer({ min: 0, max: 23 }),
    minute: fc.integer({ min: 0, max: 59 }),
    second: fc.integer({ min: 0, max: 59 }),
  })
  .map((it) => `${it.hour}:${it.minute}:${it.second}`);
const StepGenerator = fc.array(
  fc.record({
    time: TimeGenerator,
    label: fc.string(),
    deliveryTime: fc.integer(),
  }),
);

describe('TourCalculator', () => {
  it('should characterize behavior', () => {
    fc.assert(
      fc.property(StepGenerator, (steps: Step[]) => {
        const legacyTourCalculator = new TourCalculator(steps);
        const newTourCalculator = new NewTourCalculator(steps);

        expect(legacyTourCalculator.calculate()).toEqual(
          newTourCalculator.calculate(),
        );
        // Test twice because we have a different behavior on 2nd run
        expect(legacyTourCalculator.calculate()).toEqual(
          newTourCalculator.calculate(),
        );
        expect(legacyTourCalculator.deliveryTime).toEqual(
          newTourCalculator.deliveryTime,
        );
      }),
    );
  });
});
