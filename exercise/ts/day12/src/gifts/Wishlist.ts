import type { Toy } from './Toy';

export class Wishlist {
  constructor(
    private readonly _firstChoice: Toy,
    private readonly _secondChoice: Toy,
    private readonly _thirdChoice: Toy,
  ) {}

  get firstChoice(): Toy {
    return this._firstChoice;
  }

  get secondChoice(): Toy {
    return this._secondChoice;
  }

  get thirdChoice(): Toy {
    return this._thirdChoice;
  }
}
