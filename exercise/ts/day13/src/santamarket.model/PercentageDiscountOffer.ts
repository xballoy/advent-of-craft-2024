import { Option } from 'effect';
import { Discount } from './Discount';
import type { MarketingOffer } from './MarketingOffer';
import type { Product } from './Product';

export class PercentageDiscountOffer implements MarketingOffer {
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
