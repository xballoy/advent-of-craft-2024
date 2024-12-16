import assert from 'node:assert';
import { Either } from 'effect';
import { Business } from '../src/business';
import { Factory, Inventory, WishList } from '../src/dependencies';
import { Child, Gift, ManufacturedGift } from '../src/models';

describe('Business Logic', () => {
  let factory: Factory;
  let inventory: Inventory;
  let wishList: WishList;
  let john: Child;
  let toy: Gift;
  let manufacturedGift: ManufacturedGift;

  beforeEach(() => {
    factory = new Factory();
    inventory = new Inventory();
    wishList = new WishList();

    john = new Child('John');
    toy = new Gift('Toy');
    manufacturedGift = new ManufacturedGift('123');
  });

  test('Gift should be loaded into Sleigh', () => {
    wishList.set(john, toy);
    factory.set(toy, manufacturedGift);
    inventory.set('123', toy);

    const business = new Business(factory, inventory, wishList);
    const sleigh = business.loadGiftsInSleigh(john);

    const toyForJohn = sleigh.get(john);
    assert(toyForJohn);
    Either.match(toyForJohn, {
      onRight: (gift) => {
        expect(gift).toBe(toy);
      },
      onLeft: (error) => {
        throw new Error(`Unexpected error: ${error.message}`);
      },
    });
  });

  test('Gift should not be loaded if child is not on the wish list', () => {
    const business = new Business(factory, inventory, wishList);
    const sleigh = business.loadGiftsInSleigh(john);

    const toyForJohn = sleigh.get(john);
    assert(toyForJohn);
    Either.match(toyForJohn, {
      onRight: (gift) => {
        throw new Error(`Unexpected toy: ${gift.name}`);
      },
      onLeft: (error) => {
        expect(error.message).toBe(
          "Missing gift: Child wasn't nice this year!",
        );
      },
    });
  });

  test('Gift should not be loaded if the toy was not manufactured', () => {
    wishList.set(john, toy);

    const business = new Business(factory, inventory, wishList);
    const sleigh = business.loadGiftsInSleigh(john);

    const toyForJohn = sleigh.get(john);
    assert(toyForJohn);
    Either.match(toyForJohn, {
      onRight: (gift) => {
        throw new Error(`Unexpected toy: ${gift.name}`);
      },
      onLeft: (error) => {
        expect(error.message).toBe("Missing gift: Gift wasn't manufactured!");
      },
    });
  });

  test('Gift should not be loaded if the toy was misplaced', () => {
    wishList.set(john, toy);
    factory.set(toy, manufacturedGift);

    const business = new Business(factory, inventory, wishList);
    const sleigh = business.loadGiftsInSleigh(john);

    const toyForJohn = sleigh.get(john);
    assert(toyForJohn);
    Either.match(toyForJohn, {
      onRight: (gift) => {
        throw new Error(`Unexpected toy: ${gift.name}`);
      },
      onLeft: (error) => {
        expect(error.message).toBe(
          'Missing gift: The gift has probably been misplaced by the elves!',
        );
      },
    });
  });
});
