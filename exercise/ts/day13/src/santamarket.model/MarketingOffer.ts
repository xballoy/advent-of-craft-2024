import type { Option } from 'effect';
import type { Discount } from './Discount';
import type { Product } from './Product';

export type MarketingOffer = {
  tryApplyOffer(args: {
    quantity: number;
    unitPrice: number;
    product: Product;
  }): Option.Option<Discount>;
};
