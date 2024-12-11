import {ToyType} from "./toyType";
import { Match } from 'effect';

export class Preparation {
    static prepareGifts(numberOfGifts: number): string {
        if (numberOfGifts <= 0) {
            return 'No gifts to prepare.';
        } else if (numberOfGifts < 50) {
            return 'Elves will prepare the gifts.';
        }
        return 'Santa will prepare the gifts.';
    }

    static categorizeGift(age: number): string {
        if (age <= 2) {
            return 'Baby';
        } else if (age <= 5) {
            return 'Toddler';
        } else if (age <= 12) {
            return 'Child';
        }
        return 'Teen';
    }

    static ensureToyBalance(toyType: ToyType, toysCount: number, totalToys: number): boolean {
        const typePercentage = toysCount / totalToys;

        return Match.value(toyType).pipe(
            Match.when(ToyType.EDUCATIONAL, () => typePercentage >= 0.25),
            Match.when(ToyType.FUN, () => typePercentage >= 0.30),
            Match.when(ToyType.CREATIVE, () => typePercentage >= 0.20),
            Match.exhaustive
        )
    }
}
