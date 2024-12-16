import { Either, pipe } from 'effect';
import type { Factory, Inventory, WishList } from './dependencies';
import { type Child, Sleigh } from './models';

export class Business {
  constructor(
    private factory: Factory,
    private inventory: Inventory,
    private wishList: WishList,
  ) {}

  loadGiftsInSleigh(...children: Child[]): Sleigh {
    const sleigh = new Sleigh();
    for (const child of children) {
      const gift = pipe(
        this.wishList.identifyGift(child),
        Either.liftPredicate(
          (gift) => !!gift,
          () => "Missing gift: Child wasn't nice this year!",
        ),
        Either.flatMap((gift) =>
          pipe(
            this.factory.findManufacturedGift(gift),
            Either.liftPredicate(
              (it) => !!it,
              () => "Missing gift: Gift wasn't manufactured!",
            ),
          ),
        ),
        Either.flatMap((manufacturedGift) =>
          pipe(
            this.inventory.pickUpGift(manufacturedGift.barCode),
            Either.liftPredicate(
              (it) => !!it,
              () =>
                'Missing gift: The gift has probably been misplaced by the elves!',
            ),
          ),
        ),
      );

      Either.match(gift, {
        onRight: (gift) =>
          sleigh.set(child, `Gift: ${gift.name} has been loaded!`),
        onLeft: (error) => sleigh.set(child, error),
      });
    }

    return sleigh;
  }
}
