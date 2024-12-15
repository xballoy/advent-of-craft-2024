import { Option } from 'effect';
import { Discount } from './Discount';
import type { OfferType } from './OfferType';
import type { Product } from './Product';

export class XForYOffer implements OfferType {
  constructor(
    public x: number,
    public y: number,
  ) {}

  tryApplyOffer({
    quantity,
    unitPrice,
    product,
  }: {
    quantity: number;
    unitPrice: number;
    product: Product;
  }): Option.Option<Discount> {
    if (quantity < this.x) {
      return Option.none();
    }

    const numberOfXs = Math.floor(quantity / this.x);
    const discountAmount =
      quantity * unitPrice -
      (numberOfXs * this.y * unitPrice + (quantity % this.x) * unitPrice);
    return Option.some(
      new Discount(product, `${this.x} for ${this.y}`, -discountAmount),
    );
  }
}
