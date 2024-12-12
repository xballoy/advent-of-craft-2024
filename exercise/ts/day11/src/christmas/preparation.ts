import { Match } from 'effect';
import { ToyType } from './toyType';

// biome-ignore lint/complexity/noStaticOnlyClass: keep exercise as-is
export class Preparation {
  static prepareGifts(numberOfGifts: number): string {
    if (numberOfGifts <= 0) {
      return 'No gifts to prepare.';
    }

    if (numberOfGifts < 50) {
      return 'Elves will prepare the gifts.';
    }

    return 'Santa will prepare the gifts.';
  }

  static categorizeGift(age: number): string {
    if (age <= 2) {
      return 'Baby';
    }

    if (age <= 5) {
      return 'Toddler';
    }

    if (age <= 12) {
      return 'Child';
    }

    return 'Teen';
  }

  static ensureToyBalance(
    toyType: ToyType,
    toysCount: number,
    totalToys: number,
  ): boolean {
    const typePercentage = toysCount / totalToys;

    return Match.value(toyType).pipe(
      Match.when(ToyType.EDUCATIONAL, () => typePercentage >= 0.25),
      Match.when(ToyType.FUN, () => typePercentage >= 0.3),
      Match.when(ToyType.CREATIVE, () => typePercentage >= 0.2),
      Match.exhaustive,
    );
  }
}
