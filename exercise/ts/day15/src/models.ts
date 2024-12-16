import type { Either } from 'effect';
import type { NonDeliverableGift } from './NonDeliverableGift';

export class Gift {
  constructor(public name: string) {}
}

export class ManufacturedGift {
  constructor(public barCode: string) {}
}

export class Child {
  constructor(public name: string) {}
}

export class Sleigh extends Map<
  Child,
  Either.Either<Gift, NonDeliverableGift>
> {}
