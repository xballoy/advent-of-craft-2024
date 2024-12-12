import type { Toy } from './Toy';
import { Wishlist } from './Wishlist';

export class Child {
  public wishlist: Wishlist | undefined;

  constructor(
    public name: string,
    public behavior: string,
  ) {}

  setWishlist(firstChoice: Toy, secondChoice: Toy, thirdChoice: Toy): void {
    this.wishlist = new Wishlist(firstChoice, secondChoice, thirdChoice)
  }
}
