import { Either, pipe } from 'effect';
import { NonDeliverableGift } from './NonDeliverableGift';
import type { Child, Gift, ManufacturedGift } from './models';

export class Factory extends Map<Gift, ManufacturedGift> {
  findManufacturedGift(
    gift: Gift,
  ): Either.Either<ManufacturedGift, NonDeliverableGift> {
    return pipe(
      this.get(gift),
      Either.liftPredicate(
        (it) => !!it,
        () => new NonDeliverableGift("Missing gift: Gift wasn't manufactured!"),
      ),
    );
  }
}

export class Inventory extends Map<string, Gift> {
  pickUpGift(barCode: string): Either.Either<Gift, NonDeliverableGift> {
    return pipe(
      this.get(barCode),
      Either.liftPredicate(
        (it) => !!it,
        () =>
          new NonDeliverableGift(
            'Missing gift: The gift has probably been misplaced by the elves!',
          ),
      ),
    );
  }
}

export class WishList extends Map<Child, Gift> {
  identifyGift(child: Child): Either.Either<Gift, NonDeliverableGift> {
    return pipe(
      this.get(child),
      Either.liftPredicate(
        (it) => !!it,
        () =>
          new NonDeliverableGift("Missing gift: Child wasn't nice this year!"),
      ),
    );
  }
}
