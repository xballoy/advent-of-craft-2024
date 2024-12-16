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
        Either.flatMap((gift) => this.factory.findManufacturedGift(gift)),
        Either.flatMap((manufacturedGift) =>
          this.inventory.pickUpGift(manufacturedGift.barCode),
        ),
      );

      sleigh.set(child, gift);
    }

    return sleigh;
  }
}
