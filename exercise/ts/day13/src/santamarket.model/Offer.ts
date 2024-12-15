import type { Product } from './Product';
import type { SpecialOfferType } from './SpecialOfferType';

export class Offer {
  constructor(
    public offerType: SpecialOfferType,
    public product: Product,
    public argument: number,
  ) {}
}
