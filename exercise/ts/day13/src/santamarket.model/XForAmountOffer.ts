import { Option } from 'effect';
import { Discount } from './Discount';
import type { MarketingOffer } from './MarketingOffer';
import type { Product } from './Product';

export class XForAmountOffer implements MarketingOffer {
  constructor(
    public x: number,
    public amount: number,
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

    const total =
      this.amount * Math.floor(quantity / this.x) +
      (quantity % this.x) * unitPrice;
    const discountN = unitPrice * quantity - total;
    return Option.some(
      new Discount(product, `${this.x} for ${this.amount}`, -discountN),
    );
  }
}
