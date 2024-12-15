import { Option } from 'effect';
import { Discount } from './Discount';
import type { OfferType } from './OfferType';
import type { Product } from './Product';

export class PercentageDiscountOffer implements OfferType {
  constructor(public percentage: number) {}

  tryApplyOffer({
    quantity,
    unitPrice,
    product,
  }: {
    quantity: number;
    unitPrice: number;
    product: Product;
  }): Option.Option<Discount> {
    const discountAmount = -quantity * unitPrice * (this.percentage / 100);
    return Option.some(
      new Discount(product, `${this.percentage}% off`, discountAmount),
    );
  }
}
